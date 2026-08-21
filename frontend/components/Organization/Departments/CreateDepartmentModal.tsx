"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CreateDepartmentModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("No access token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:8001/organization/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error("Failed to fetch organization");
        return;
      }
      const res_data = await res.json();
      const organization_id = res_data.organization_id;

      const response = await fetch("http://localhost:8001/department/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          organization_id,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to send request to the server");
        return;
      }

      const data = await response.json();
      toast.success("Department Created Successfully");
      console.log("Created department:", data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Create New Department</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Department Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentModal;
