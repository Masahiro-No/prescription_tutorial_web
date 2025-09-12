// src/app/prescription/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
    try {
        const prescription = await prisma.prescription.findUnique({
            where: { id: params.id },
            include: {
                items: { include: { medicine: true } },
            },
        });

        if (!prescription) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(prescription);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Fetch failed" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        await prisma.$transaction([
            prisma.prescriptionItem.deleteMany({
                where: { prescriptionId: params.id },
            }),
            prisma.prescription.delete({
                where: { id: params.id },
            }),
        ]);

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (e: any) {
        // จับ error FK (P2003) ให้สถานะอ่านง่ายขึ้น
        if (e?.code === "P2003") {
            return NextResponse.json(
                { error: "Cannot delete: related items exist." },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: e?.message ?? "Delete failed" },
            { status: 400 }
        );
    }
}