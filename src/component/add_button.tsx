import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input"
type Medicine = {
  medicineCode?: string;
  nameEN: string;
  nameTH: string;
  catagory?: string;       // คงชื่อตามที่คุณใช้เดิม
  amount?: number;
  current_price?: number;
  advice?: string;
};

type AddButtonProps = {
  defaultData?: Partial<Medicine>;
  onSuccess?: (data: any) => void;
};

const AddButton: React.FC<AddButtonProps> = ({ defaultData, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Medicine>({
    medicineCode: "",
    nameEN: "",
    nameTH: "",
    catagory: "",
    amount: 0,
    current_price: 0,
    advice: "",
    ...defaultData,
  });

  // ปิดด้วย ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ปิดเมื่อคลิกนอกโมดัล
  const closeIfOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "current_price"
          ? value === "" ? undefined : Number(value)
          : value,
    }));
  };

  const isValid =
    form.nameTH?.trim() &&
    form.nameEN?.trim() &&
    (form.amount ?? 0) >= 0 &&
    (form.current_price ?? 0) >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);

      // สร้าง medicineCode ไม่ซ้ำ
      const payload = {
        nameEN: form.nameEN,
        nameTH: form.nameTH,
        catagory: form.catagory,
        amount: form.amount,
        current_price: form.current_price,
        advice: form.advice,
        // use the medicineCode the user entered (required)
        medicineCode: form.medicineCode,
      };

      const res = await fetch("/api/medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Add failed");
      onSuccess?.(data);
      alert("เพิ่มข้อมูลสำเร็จ");
      setOpen(false);
    } catch (e: any) {
      alert(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-[#2C3E94] px-5 py-2 text-white shadow-sm transition
                   hover:bg-[#25367f] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
      >
        เพิ่มข้อมูล
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Header bar */}
            <div className="flex items-center justify-between bg-[#23297a] px-4 py-2 text-white">
              <h2 className="text-lg font-semibold">เพิ่มยา</h2>
              <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid gap-3">
              {/* ฟิลด์ต่างๆ */}
              <div className="grid gap-1.5">
                <label htmlFor="medicineCode" className="text-sm font-medium text-gray-800">รหัสยา</label>
                <Input
                  id="medicineCode"
                  name="medicineCode"
                  placeholder="เช่น MC1234"
                  value={form.medicineCode ?? ""}
                  onChange={handleChange}
                  required
                  className="rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#3F51B5] text-gray-900"
                />

                <label htmlFor="nameTH" className="text-sm font-medium text-gray-800">ชื่อไทย</label>
                <Input
                  id="nameTH"
                  name="nameTH"
                  placeholder="เช่น พาราเซตามอล"
                  value={form.nameTH}
                  onChange={handleChange}
                  required
                  className="rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#3F51B5] text-gray-900"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="nameEN" className="text-sm font-medium text-gray-800">ชื่ออังกฤษ</label>
                <Input
                  id="nameEN"
                  name="nameEN"
                  placeholder="Paracetamol"
                  value={form.nameEN}
                  onChange={handleChange}
                  required
                  className="rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#3F51B5] text-gray-900"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="catagory" className="text-sm font-medium text-gray-800">หมวดหมู่</label>
                <Input
                  id="catagory"
                  name="catagory"
                  placeholder="ทั่วไป / ยาฆ่าเชื้อ / ยาแก้แพ้ ฯลฯ"
                  value={form.catagory ?? ""}
                  onChange={handleChange}
                  className="rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#3F51B5] text-gray-900"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="amount" className="text-sm font-medium text-gray-800">จำนวน</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="0"
                  value={form.amount ?? 0}
                  onChange={handleChange}
                  className="rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#3F51B5] text-gray-900"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="current_price" className="text-sm font-medium text-gray-800">ราคา</label>
                <input
                  id="current_price"
                  name="current_price"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={form.current_price ?? 0}
                  onChange={handleChange}
                  className="rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#3F51B5] text-gray-900"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="advice" className="text-sm font-medium text-gray-800">วิธีใช้/ข้อควรระวัง</label>
                <textarea
                  id="advice"
                  name="advice"
                  rows={3}
                  placeholder="เช่น ทานครั้งละ 1 เม็ด หลังอาหาร"
                  value={form.advice ?? ""}
                  onChange={handleChange}
                  className="rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#3F51B5] text-gray-900"
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="rounded-md bg-[#C2185B] px-4 py-2 text-white transition hover:bg-[#a01048] disabled:opacity-60"
                >
                  {submitting ? "กำลังบันทึก..." : "ตกลง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddButton;

