import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const medicine = await prisma.medicine.findUnique({
    where: { id: params.id },
      include: {
    items: {
      include: {
        prescription: true, // เอาข้อมูล prescription ที่เชื่อมโยงมาด้วย
      },
    },
  },
  });
  if (!medicine) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(medicine);
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const id = params.id;
    const body = await req.json();

    // เตรียม object สำหรับ update
    const dataToUpdate: any = {};

    // ตรวจสอบและแปลงค่าตัวเลข (ถ้ามี)
    const numericFields = ["amount", "current_price", "price"];
    for (const field of numericFields) {
      if (body[field] !== undefined) {
        if (isNaN(Number(body[field]))) {
          return NextResponse.json(
            { error: `${field} ต้องเป็นตัวเลข` },
            { status: 400 }
          );
        }
        dataToUpdate[field] = new Prisma.Decimal(body[field]); // ต้อง migrate database ก่อน
      }
    }

    // ฟิลด์ string อื่นๆ
    const otherFields = ["medicineCode", "nameEN", "nameTH", "catagory", "advice"];
    for (const field of otherFields) {
      if (body[field] !== undefined) {
        dataToUpdate[field] = body[field];
      }
    }

    // ถ้ามี items จะลบของเก่าแล้วสร้างใหม่
    if (body.items !== undefined) {
      dataToUpdate.items = {
        deleteMany: {},
        create: body.items.map((item: any) => ({
          prescriptionId: item.prescriptionId,
          instruction: item.instruction ?? "",
          amount: item.amount ?? 0,
          price: item.price ?? 0,
        })),
      };
    }

    // ถ้าไม่มี field ใดๆ ใน body เลย
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: "No data to update" }, { status: 400 });
    }

    const updatedMedicine = await prisma.medicine.update({
      where: { id },
      data: dataToUpdate,
      include: {
        items: {
          include: { prescription: true },
        },
      },
    });

    return NextResponse.json(updatedMedicine, { status: 200 });

  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) { // ต้อง migrate database ก่อน
      if (e.code === 'P2025') {
        return NextResponse.json(
          { error: "ไม่พบข้อมูล Medicine ที่ต้องการอัปเดต" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: e?.message ?? "Update failed" },
      { status: 400 }
    );
  }
}
// ...existing code...

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await prisma.medicine.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Delete failed" }, { status: 400 });
  }
}