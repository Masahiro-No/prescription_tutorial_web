"use client";
import NavbarTabs from "@/component/tast_bar";


export default function precription_of_user() {
  return (
    <div className="bg-white min-h-screen">
      <NavbarTabs page="prescription" />

      <main className="p-4">
        <h1 className="text-xl font-bold">Storage of Medicines</h1>
      </main>
    </div>
  );
}