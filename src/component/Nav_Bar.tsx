"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { id: string; label: string; link: string };

export default function NavbarTabs() {
  const pathname = usePathname();

  const tabs: Tab[] = [
    { id: "list", label: "List of medicines", link: "/" },
    { id: "storage", label: "Drug storage", link: "/storage" },
    { id: "prescription", label: "Prescription", link: "/prescription" },
  ];

  // ฟังก์ชันเช็คว่า tab ไหน active จาก path ปัจจุบัน
  const isActive = (tab: Tab) => {
    if (tab.link === "/") return pathname === "/";
    // รองรับกรณี route ย่อย เช่น /storage/xxx
    return pathname.startsWith(tab.link);
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="mx-auto flex justify-center gap-8">
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.id}
              href={tab.link}
              aria-current={active ? "page" : undefined}
              className={[
                "relative py-3 px-10 text-sm font-medium transition-colors",
                active ? "text-red-600" : "text-gray-700 hover:text-red-600",
              ].join(" ")}
            >
              {tab.label}
              <span
                className={[
                  "pointer-events-none absolute left-0 right-0 -bottom-px h-0.5",
                  active ? "bg-red-600" : "bg-transparent",
                ].join(" ")}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
