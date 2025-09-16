// lib/services/medicine.ts
import { prisma } from "@/lib/prisma";

export type DeleteMedicineResult = {
  medicineId: string;
  softDeletedItemCount: number;
};

export async function deleteMedicineHardAndSoftItems(
  medicineId: string
): Promise<DeleteMedicineResult> {
  // เช็คว่ามีจริง
  const exist = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true },
  });
  if (!exist) {
    const err = new Error("Medicine not found") as any;
    err.code = "NOT_FOUND";
    throw err;
  }

  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    // 1) soft delete items ทั้งหมดที่ยังไม่ถูกลบ
    const softRes = await tx.prescriptionItem.updateMany({
      where: { medicineId: medicineId, deletedAt: null },
      data: { deletedAt: now },
    });

    // 2) hard delete medicine
    await tx.medicine.delete({ where: { id: medicineId } });

    return { softDeletedItemCount: softRes.count };
  });

  return { medicineId, ...result };
}

