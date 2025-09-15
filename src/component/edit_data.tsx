"use client";
import React, { useEffect, useState } from "react";

type Medicine = {
  id: string;
  medicineCode: string;
  nameEN: string;
  nameTH: string;
  catagory: string;
  amount: number;
  current_price: number;
  advice?: string | null;
};

type Props = {
  id: string;
  onSuccess?: () => void; // callback หลังแก้ไข/ลบสำเร็จ
};

export default function EditData({ id, onSuccess }: Props) {
  const [data, setData] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูล
  useEffect(() => {
    setLoading(true);
    fetch(`/api/medicine/${id}`)
      .then((res) => res.json())
      .then((m) => {
        // map backend shape to local Medicine type and coerce decimals to numbers
        setData({
          id: m.id,
          medicineCode: m.medicineCode ?? "",
          nameEN: m.nameEN ?? "",
          nameTH: m.nameTH ?? "",
          catagory: m.catagory ?? "",
          amount: Number(m.amount ?? 0),
          current_price: Number(m.current_price ?? m.price ?? 0),
          advice: m.advice ?? "",
        });
      })
      .catch(() => setError("โหลดข้อมูลไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [id]);

  // ฟังก์ชันแก้ไขข้อมูล
  const handleSave = async () => {
    if (!data) return;
    setLoading(true);
    setError(null);

    // map local fields back to API shape
    const payload = {
      medicineCode: data.medicineCode,
      nameEN: data.nameEN,
      nameTH: data.nameTH,
      catagory: data.catagory,
      amount: data.amount,
      current_price: data.current_price,
      advice: data.advice ?? "",
    };

    const res = await fetch(`/api/medicine/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    const res = await fetch(`/api/medicine/${id}`, { method: "DELETE" });
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
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow text-black">
      <h2 className="text-lg font-bold mb-4">แก้ไขข้อมูล medicine</h2>
      <label>รหัสยา</label>
      <input
        className="border p-2 w-full mb-2"
        value={data.medicineCode}
        onChange={(e) => setData({ ...data, medicineCode: e.target.value })}
      />

      <label>ชื่อยา (อังกฤษ)</label>
      <input
        className="border p-2 w-full mb-2"
        value={data.nameEN}
        onChange={(e) => setData({ ...data, nameEN: e.target.value })}
      />

      <label>ชื่อยา (ไทย)</label>
      <input
        className="border p-2 w-full mb-2"
        value={data.nameTH}
        onChange={(e) => setData({ ...data, nameTH: e.target.value })}
      />

      <label>ประเภทยา</label>
      <input
        className="border p-2 w-full mb-2"
        value={data.catagory}
        onChange={(e) => setData({ ...data, catagory: e.target.value })}
      />

      <label>จำนวน</label>
      <input
        type="number"
        className="border p-2 w-full mb-2"
        value={data.amount}
        onChange={(e) => setData({ ...data, amount: Number(e.target.value) })}
      />

      <label>ราคา</label>
      <input
        type="number"
        step="0.01"
        className="border p-2 w-full mb-2"
        value={data.current_price}
        onChange={(e) => setData({ ...data, current_price: Number(e.target.value) })}
      />

      <label>หมายเหตุ / คำแนะนำ</label>
      <textarea
        className="border p-2 w-full mb-2"
        value={data.advice ?? ""}
        onChange={(e) => setData({ ...data, advice: e.target.value })}
      />

          <div className="flex gap-2 mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleSave}
              disabled={loading}
            >
              บันทึก
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleDelete}
              disabled={loading}
            >
              ลบข้อมูล
            </button>
          </div>
        </div>
      );
    }