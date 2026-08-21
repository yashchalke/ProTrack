"use client"
import DepartmentHomeCard from '@/components/Organization/Departments/DepartmentHomeCard'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

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
        const res = await fetch("http://localhost:8001/department/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          toast.error("Failed to fetch departments");
          return;
        }

        const data = await res.json();
        setDepartments(data); // ✅ update state
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };

    fetchDepartments();
  }, []);
  return (
    <div className="grid grid-cols-3 gap-5">
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
    </div>
  )
}

export default Page