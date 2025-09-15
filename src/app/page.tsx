"use client";
import SimpleTable from "@/component/simple_table";
import AddButton from "@/component/add_button";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import EditData from "@/component/edit_data";
type Medicine = {
  id: string;
  medicineCode: string;
  nameEN: string;
  nameTH: string;
  catagory: string;
  amount: number;
  current_price: number;
};

const medicineColumns: ColumnDef<Medicine>[] = [
  { accessorKey: "medicineCode", header: "รหัสยา" },
  { accessorKey: "nameEN", header: "ชื่อยา (อังกฤษ)" },
  { accessorKey: "nameTH", header: "ชื่อยา (ไทย)" },
  { accessorKey: "catagory", header: "หมวดหมู่" },
  { accessorKey: "amount", header: "จำนวน", },
  { accessorKey: "current_price", header: "ราคา", },
];

export default function List_of_medicine() {
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/medicine")
      .then((res) => res.json())
      .then((meds: Medicine[]) => {
        setData(meds);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div className="p-4">
        <h1 className="text-xl font-bold text-black">List of Medicines</h1>
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div />
              <AddButton
                onSuccess={(m) => {
                  // append or refresh list; we'll refresh for simplicity
                  setLoading(true);
                  fetch("/api/medicine")
                    .then((res) => res.json())
                    .then((meds: Medicine[]) => setData(meds))
                    .finally(() => setLoading(false));
                }}
              />
            </div>
            <SimpleTable<Medicine>
              data={data}
              columns={medicineColumns}
              className="w-[100%]"
              onRowClick={(r) => setSelectedId(r.id)}
              rowKey={(r) => r.id}
            />
          </div>

          <div className="w-[40%]">
            {selectedId ? (
              <EditData
                id={selectedId}
                onSuccess={() => {
                  // refresh list and close editor
                  setLoading(true);
                  fetch("/api/medicine")
                    .then((res) => res.json())
                    .then((meds: Medicine[]) => setData(meds))
                    .finally(() => setLoading(false));
                  setSelectedId(null);
                }}
              />
            ) : (
              <div className="p-4 text-gray-600">เลือกแถวเพื่อแก้ไข</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
