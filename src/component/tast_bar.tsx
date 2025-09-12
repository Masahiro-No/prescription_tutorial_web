
type NavbarTabsProps ={
  page?: string;
}
export default function NavbarTabs({ page = "list" }: NavbarTabsProps) {
  
  const tabs = [
    { id: "list", label: "List of medicines" ,link:"/"},
    { id: "storage", label: "Drug storage" ,link:"/storage"},
    { id: "manufacturer", label: "Manufacturer" ,link:"/manufacturer"},
    { id: "prescription", label: "Prescription" ,link:"/prescription"},
  ];
  return (
    <div className="w-full bg-white shadow-sm border-b mb-4">
      <div className="flex justify-center space-x-8 m-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {window.location.href=tab.link;}}
            className={`py-3 px-10 font-medium text-sm transition-all 
              ${
                page === tab.id
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-700 hover:text-red-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
