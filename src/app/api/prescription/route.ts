import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
    const data = await prisma.prescription.findMany({
        include: {
            items: { include: { medicine: true } },
        },
        orderBy: { date: 'desc' },
    })
    return NextResponse.json(data)
}

// POST: ใช้ medicineCode แทน medicineId และดึง price จาก Medicine
export async function POST(req: Request) {
    try {
        const body = await req.json()
        // body: { name_patient, name_docter, date, items: [{ medicineCode, instruction?, amount }] }

        // ดึง medicine ที่เกี่ยวข้อง
        const codes = (body.items ?? []).map((it: any) => it.medicineCode)
        const medicines = await prisma.medicine.findMany({
            where: { medicineCode: { in: codes } },
        })

        // แปลงเป็น map: { code -> medicine }
        const codeToMedicine: Record<string, typeof medicines[0]> = {}
        medicines.forEach((m) => (codeToMedicine[m.medicineCode] = m))

        // เตรียม data สำหรับ create
        const itemsData = (body.items ?? []).map((it: any) => {
            const med = codeToMedicine[it.medicineCode]
            if (!med) throw new Error(`ไม่พบ medicineCode: ${it.medicineCode}`)
            if (it.amount === undefined) {
                throw new Error(`ต้องกำหนด amount ของ ${it.medicineCode}`)
            }
            return {
                medicineId: med.id,
                instruction: it.instruction ?? null,
                amount: new Prisma.Decimal(it.amount as any),             // ผู้ใช้กำหนดเอง
                price: new Prisma.Decimal(med.current_price as any),      //ใช้จาก Medicine
            }
        })

        const created = await prisma.prescription.create({
            data: {
                name_patient: body.name_patient,
                name_docter: body.name_docter,
                date: body.date ? new Date(body.date) : new Date(),
                items: { create: itemsData },
            },
            include: {
                items: { include: { medicine: true } },
            },
        })

        return NextResponse.json(created, { status: 201 })
    } catch (e: any) {
        console.error(e)
        return NextResponse.json(
            { error: e.message ?? 'create failed' },
            { status: 400 }
        )
    }
}