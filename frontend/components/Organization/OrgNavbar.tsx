"use client"
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const OrgNavbar = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: "/organization/overview" },
    { name: "Departments", href: "/organization/departments" },
    { name: "Locations", href: "/organization/locations" },
  ];

  const activeTab = tabs.find((tab) => pathname?.startsWith(tab.href)) || tabs[0];

  return (
    <div className="w-full flex justify-between items-center border-b border-gray-200">
      <div className="flex gap-x-2">
        {tabs.map((item) => {
          const isActive = activeTab.href === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`py-3 px-4 font-medium transition-colors border-b-2 -mb-[1px] ${
                isActive
                  ? "border-amber-500 text-orange-500 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      <button
        className={`bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2 rounded-lg text-white font-medium text-sm ${
          activeTab.href === "/organization/departments" ? "block" : "hidden"
        }`}
      >
        + Add New Department
      </button>
    </div>
  );
};

export default OrgNavbar;