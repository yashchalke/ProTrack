import React from "react";
import SidebarOptions from "./SidebarOptions";
import LogoutButton from "./LogoutButton";

const Sidebar = () => {
  const options = [
    { id: 1, name: "Home", path: "/home" },
    { id: 2, name: "Organization", path: "/organization" },
    { id: 3, name: "Dashboard", path: "/dashboard" },
    { id: 4, name: "Attendance", path: "/attendance" },
    { id: 5, name: "Tasks", path: "/tasks" },
    { id: 6, name: "Calendar", path: "/calendar" },
    { id: 7, name: "Emails", path: "/emails" },
    { id: 8, name: "Performance", path: "/performance" },
    { id: 9, name: "Payslips", path: "/payslips" },
    { id: 10, name: "Documents", path: "/documents" },
    { id: 11, name: "Profile Settings", path: "/settings" },
  ];
  return (
    <div className="max-w-60 min-h-screen border-r-2 border-[#FF6200]/30 px-4 flex flex-col justify-between">
      <div>
        <div className="flex h-10 w-full items-center justify-center p-10 font-semibold text-2xl">
          <h1>ProTrack</h1>
        </div>
        <div className="flex flex-col divide-y divide-gray-200">
          {options.map((item)=>(
            <SidebarOptions key={item.id} name={item.name} path={item.path} />
          ))}
        </div>
      </div>
      <div className="flex flex-col py-4 gap-y-1">
        <LogoutButton />
        <div className="border-b-2"></div>
        <p className="text-center text-sm text-black/40 font-medium">
          ProTrack V.1.0.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
