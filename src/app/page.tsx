"use client";
import NavbarTabs from "@/component/Nav_Bar";
import SimpleTable from "@/component/simple_table";
import AddButton from "@/component/add_button"; // เพิ่มบรรทัดนี้
import type { ColumnDef } from "@tanstack/react-table";

type Medicine = {
  id: string;
  code: string;
  name: string;
  category: string;
  amount: number;
  price: number;
};

const medicineColumns: ColumnDef<Medicine>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "code", header: "รหัสยา" },
  { accessorKey: "name", header: "ชื่อยา" },
  { accessorKey: "category", header: "หมวดหมู่" },
  { accessorKey: "amount", header: "จำนวน", },
  { accessorKey: "price", header: "ราคา", },
];

const fakeMedicines: Medicine[] = [
  { id: "xxx", code: "007", name: "Paracetamol", category: "ทั่วไป", amount: 50, price: 12.5 },
];

export default function List_of_medicine() {
  return (
    <div>
      <div className="p-4">
        <h1 className="text-xl font-bold text-black">List of Medicines</h1>
        <div className="mb-4">
          <AddButton />
        </div>
        <SimpleTable<Medicine>
          data={fakeMedicines}
          columns={medicineColumns}
          className="w-[80%]"
          onRowClick={(r) => console.log("clicked medicine", r)}
          rowKey={(r) => r.id}
        />
      </div>
    </div>
  );
}
