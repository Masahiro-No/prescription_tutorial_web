"use client";
import React, { useEffect, useState } from "react";

type EditType = "medicine" | "prescription";

type Medicine = {
  id: string;
  code: string;
  name: string;
  category: string;
  amount: number;
  price: number;
};

type Prescription = {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  // เพิ่ม field ตาม schema จริง
};

type Props = {
  id: string;
  type: EditType; // "medicine" หรือ "prescription"
  onSuccess?: () => void; // callback หลังแก้ไข/ลบสำเร็จ
};

export default function EditData({ id, type, onSuccess }: Props) {
  const [data, setData] = useState<Medicine | Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูล
  useEffect(() => {
    setLoading(true);
    fetch(`/api/${type}/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError("โหลดข้อมูลไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [id, type]);

  // ฟังก์ชันแก้ไขข้อมูล
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      onSuccess?.();
      alert("บันทึกสำเร็จ");
    } else {
      setError("บันทึกไม่สำเร็จ");
    }
    setLoading(false);
  };

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async () => {
    if (!confirm("ต้องการลบข้อมูลนี้จริงหรือไม่?")) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    if (res.ok) {
      onSuccess?.();
      alert("ลบสำเร็จ");
    } else {
      setError("ลบไม่สำเร็จ");
    }
    setLoading(false);
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>ไม่พบข้อมูล</div>;

  // ฟอร์มแก้ไข (medicine/prescription)
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">แก้ไขข้อมูล {type}</h2>
      {type === "medicine" ? (
        <>
          <label>ชื่อยา</label>
          <input
            className="border p-2 w-full mb-2"
            value={(data as Medicine).name}
            onChange={e => setData({ ...(data as Medicine), name: e.target.value })}
          />
          <label>ประเภทยา</label>
          <input
            className="border p-2 w-full mb-2"
            value={(data as Medicine).category}
            onChange={e => setData({ ...(data as Medicine), category: e.target.value })}
          />
          <label>จำนวน</label>
          <input
            className="border p-2 w-full mb-2"
            value={(data as Medicine).amount}
            onChange={e => setData({ ...(data as Medicine), amount: Number(e.target.value) })}
          />
          <label>ราคา</label>
          <input
            className="border p-2 w-full mb-2"
            value={(data as Medicine).price}
            onChange={e => setData({ ...(data as Medicine), price: Number(e.target.value) })}
          />
        </>
      ) : (
        <>
          <label>ชื่อผู้ป่วย</label>
          <input
            className="border p-2 w-full mb-2"
            value={(data as Prescription).patientName}
            onChange={e => setData({ ...(data as Prescription), patientName: e.target.value })}
          />
            <label>ชื่อแพทย์</label>
            <input
              className="border p-2 w-full mb-2"
              value={(data as Prescription).doctorName}
              onChange={e => setData({ ...(data as Prescription), doctorName: e.target.value })}
            />
            <label>วันที่</label>
          <input
            className="border p-2 w-full mb-2"
            value={(data as Prescription).date}
            onChange={e => setData({ ...(data as Prescription), date: e.target.value })}
          />
        </>
      )}
      <div className="flex gap-2 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave} disabled={loading}>
          บันทึก
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete} disabled={loading}>
          ลบข้อมูล
        </button>
      </div>
    </div>
  );
}