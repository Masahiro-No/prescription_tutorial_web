"use client";
import SimpleTable from "@/component/simple_table";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import EditData from "@/component/edit_data";
import { log } from "console";

type PrescriptionResponse = {
  data: Precription[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
};

type Precription = {
  id: String;
  name_patient: String;
  name_docter: String;
};

const prescriptionColumns: ColumnDef<Precription>[] = [
  { accessorKey: "name_patient", header: "ชื่อผู้ป่วย" },
  { accessorKey: "name_docter", header: "ชื่อแพทย์" },
];

export default function precription_of_user() {
  const [data, setData] = useState<Precription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/prescription")
      .then((res) => res.json())
      .then((res: PrescriptionResponse) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  console.log(data);

  return (
    <div className="bg-white min-h-screen">
      <main className="p-4">
        <h1 className="text-xl font-bold text-black">Storage of Medicines</h1>
        <SimpleTable<Precription>
          data={data}
          columns={prescriptionColumns}
          className="w-[100%]"
        />
      </main >
    </div >
  );
}