-- DropForeignKey
ALTER TABLE "public"."PrescriptionItem" DROP CONSTRAINT "PrescriptionItem_medicineListed_fkey";

-- AlterTable
ALTER TABLE "public"."PrescriptionItem" ALTER COLUMN "medicineListed" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_medicineListed_fkey" FOREIGN KEY ("medicineListed") REFERENCES "public"."Medicine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
