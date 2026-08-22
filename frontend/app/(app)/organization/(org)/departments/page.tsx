"use client";
import DepartmentHomeCard from "@/components/Organization/Departments/DepartmentHomeCard";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

type Department = {
  id: number;
  name: string;
  organization_id: number;
  employee_count: number;
  team_count: number;
};

const Page = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("No access token found");
        return;
      }

      try {
        const orgRes = await fetch("http://localhost:8001/organization/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!orgRes.ok) {
          toast.error("Failed to fetch organization");
          return;
        }
        const orgData = await orgRes.json();
        const organization_id = orgData.organization_id;

        const deptRes = await fetch(
          `http://localhost:8001/department/organization/${organization_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!deptRes.ok) {
          toast.error("Failed to fetch departments");
          return;
        }

        const deptData = await deptRes.json();
        console.log("test console log:",deptData)
        setDepartments(deptData.departments);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-5">
      {
        departments.map((item)=>(
          <Link key={item.id} href={`/organization/departments/${item.id}`}>
          <DepartmentHomeCard name={item.name} emp_count={item.employee_count} teams_count={item.team_count}/>
          </Link>
        ))
      }
    </div>
  );
};

export default Page;
