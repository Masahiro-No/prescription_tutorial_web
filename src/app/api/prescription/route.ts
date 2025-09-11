import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
const medicines = await prisma.medicine.findMany({
  include: {
    items: {
      include: {
        prescription: true,
      },
    },
  },
});
  return NextResponse.json(medicines);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.amount !== undefined) {
      if (isNaN(Number(body.amount))) {
        return NextResponse.json(
          { error: "amount ต้องเป็นตัวเลข" },
          { status: 400 }
        );
      }
      body.amount = new Prisma.Decimal(body.amount); // ต้อง migrate database ก่อน
    }

    if (body.current_price !== undefined) {
      if (isNaN(Number(body.current_price))) {
        return NextResponse.json(
          { error: "current_price ต้องเป็นตัวเลข" },
          { status: 400 }
        );
      }
      body.current_price = new Prisma.Decimal(body.current_price); // ต้อง migrate database ก่อน
    }
    
    if (body.price !== undefined) {
      if (isNaN(Number(body.price))) {
        return NextResponse.json(
          { error: "price ต้องเป็นตัวเลข" },
          { status: 400 }
        );
      }
      body.price = new Prisma.Decimal(body.price); // ต้อง migrate database ก่อน
    }

    const created = await prisma.medicine.create({
      data: {
        medicineCode: body.medicineCode ?? "",
        nameEN: body.nameEN,
        nameTH: body.nameTH,
        catagory: body.catagory,
        amount: body.amount ?? 0,
        current_price: body.current_price ?? 0,
        advice: body.advice ?? "",
        items: {
          create: body.items?.map((item: any) => ({
            prescriptionId: item.prescriptionId,
            instruction: item.instruction ?? "",
            amount: item.amount ?? 0,
            price: item.price ?? 0,
          })) ?? [],
        },
      },
    });

    const res = NextResponse.json(created, { status: 201 });
    res.headers.set("Location", `/api/medicines/${created.id}`);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Create failed" },
      { status: 400 }
    );
  }
}