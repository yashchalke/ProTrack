"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';

type SidebarOptionsProps = {
  name: string;
  path: string; 
};

const SidebarOptions = ({name,path}:SidebarOptionsProps) => {
    const pathname = usePathname();
    const isActive = pathname === path || path !== "/" && pathname.startsWith(path);

  return (
    <Link href={path} className={`px-4 py-3 rounded-md cursor-pointer 
        ${isActive ? "bg-[#FE924F]/40 text-[#FF6200] font-semibold" : "text-black/60"}
      `}>
        <h1>
            {name}
        </h1>
    </Link>
  )
}

export default SidebarOptions