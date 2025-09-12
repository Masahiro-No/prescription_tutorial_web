"use client";
import NavbarTabs from "@/component/tast_bar";
import SimpleTable from "@/component/simple_table";
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
    <div className="bg-white min-h-screen">
      <NavbarTabs page="list" />
      <main className="p-4">
        <h1 className="text-xl font-bold">List of Medicines</h1>
        <SimpleTable<Medicine>
          data={fakeMedicines}
          columns={medicineColumns}
          className="w-[80%]"
          onRowClick={(r) => console.log("clicked medicine", r)}
          rowKey={(r) => r.id}
        />
      </main>
    </div>
  );
}
