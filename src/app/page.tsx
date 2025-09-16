"use client";
import SimpleTable from "@/component/simple_table";
import AddButton from "@/component/add_button";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import EditData from "@/component/edit_data";
import { Input } from "@/components/ui/input"

type Medicine = {
  id: string;
  medicineCode: string;
  nameEN: string;
  nameTH: string;
  catagory: string;
  amount: number;
  current_price: number;
  advice: string | null;
};

const medicineColumns: ColumnDef<Medicine>[] = [
  { accessorKey: "medicineCode", header: "รหัสยา" },
  { accessorKey: "nameEN", header: "ชื่อยา (อังกฤษ)" },
  { accessorKey: "nameTH", header: "ชื่อยา (ไทย)" },
  { accessorKey: "catagory", header: "หมวดหมู่" },
  { accessorKey: "amount", header: "จำนวน", },
  { accessorKey: "current_price", header: "ราคา", },
  { accessorKey: "advice", header: "คำแนะนำ" },
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

          {/* Modal popup for EditData */}
          {selectedId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px]">
                <EditData
                  id={selectedId}
                  onSuccess={() => {
                    setLoading(true);
                    fetch("/api/medicine")
                      .then((res) => res.json())
                      .then((meds: Medicine[]) => setData(meds))
                      .finally(() => setLoading(false));
                    setSelectedId(null);
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black"
                    onClick={() => setSelectedId(null)}
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
