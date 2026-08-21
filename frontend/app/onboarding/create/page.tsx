"use client";
import React, { useState, useEffect } from "react";
import { Building2, FileText, MapPin, Globe, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white";
const labelCls =
  "block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide";

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-blue-600" />
      </div>
      <span className="text-sm font-semibold text-gray-700">{title}</span>
      <div className="flex-1 h-px bg-gray-100 ml-1" />
    </div>
  );
}

type Role = {
  id: number;
  name: string;
};

type formdata = {
    logo_url: string;
    name: string;
    description: string;
    address: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    role_id: number | null;
}

const Page = () => {
  const [formData, setFormData] = useState<formdata>({
    logo_url: "",
    name: "",
    description: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    role_id: null,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [logoUploaded, setLogoUploaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const get_roles = async () => {
      const response = await fetch(
        "http://localhost:8001/organization/global-roles",
        { method: "GET", headers: { "content-type": "application/json" } },
      );
      const data = await response.json();
      setRoles(data.roles);
    };
    get_roles();
  }, []);
  console.log("Roles Fetched:", roles);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch(
        "http://localhost:8001/organization/upload-logo",
        { method: "POST", body: data },
      );
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      console.log("logo uploaded Successfully:", result);
      setFormData({ ...formData, logo_url: result.logo_url });
      setLogoUploaded(true);
    } catch (err) {
      console.error("Error uploading logo:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log(formData);
      const token = localStorage.getItem("access_token")
      const response = await fetch(
        "http://localhost:8001/organization/create",
        {
          method: "POST",
          headers: { "content-type": "application/json","Authorization":`Bearer ${token}`},
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) {
        toast.error("Failed to Submit the form");
        return;
      }
      const data = await response.json();
      toast.success(data.message);
      router.push('/home')
    } catch (err) {
      console.log(err);
    } finally {
      setFormData({
        logo_url: "",
        name: "",
        description: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        role_id: null,
      });
      setLogoUploaded(false); 
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Create New Organization
        </h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Fill in the details below to set up your workspace.
        </p>
      </div>

      <form className="flex flex-col gap-y-1" onSubmit={handleSubmit}>
        {/* ── Identity ── */}
        <SectionHeader icon={Building2} title="Organization Identity" />

        {/* Logo upload */}
        <div className="mb-4">
          <label className={labelCls}>Logo</label>
          {logoUploaded ? (
            <div className="flex flex-col items-center justify-center w-full h-28 border-2 border-green-300 rounded-xl bg-green-50 text-green-700 font-medium">
              ✅ Logo uploaded successfully
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all group">
              <Upload className="w-6 h-6 text-gray-300 group-hover:text-blue-400 mb-1 transition-colors" />
              <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                Click to upload logo
              </span>
              <span className="text-[10px] text-gray-300 mt-0.5">
                PNG, JPG up to 2 MB
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <div className="mb-4">
          <label className={labelCls}>Organization Name</label>
          <input
            type="text"
            placeholder="e.g. Acme Corp"
            className={inputCls}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
          />
        </div>

        {/* ── About ── */}
        <SectionHeader icon={FileText} title="About" />

        <div className="mb-4">
          <label className={labelCls}>Description</label>
          <textarea
            rows={3}
            placeholder="Brief description of what your organization does..."
            className={`${inputCls} resize-none`}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            value={formData.description}
          />
        </div>

        {/* ── Location ── */}
        <SectionHeader icon={MapPin} title="Location" />

        <div className="mb-4">
          <label className={labelCls}>Street Address</label>
          <textarea
            rows={2}
            placeholder="e.g. 12 Business Park, Sector 5"
            className={`${inputCls} resize-none`}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            value={formData.address}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls}>Country</label>
            <input
              type="text"
              placeholder="India"
              className={inputCls}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              value={formData.country}
            />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input
              type="text"
              placeholder="Maharashtra"
              className={inputCls}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              value={formData.state}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls}>City</label>
            <input
              type="text"
              placeholder="Mumbai"
              className={inputCls}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              value={formData.city}
            />
          </div>
          <div>
            <label className={labelCls}>Pin Code</label>
            <input
              type="text"
              placeholder="400001"
              className={inputCls}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
              value={formData.pincode}
            />
          </div>
        </div>

        {/* ── Your Role ── */}
        <SectionHeader icon={Globe} title="Your Role" />

        <Select
          onValueChange={(value) =>
            setFormData({ ...formData, role_id: Number(value) })
          }
          value={formData.role_id}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 active:scale-[0.99] text-white text-sm font-semibold py-3 rounded-xl transition-all 
    ${
      isSubmitting
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200"
    }`}
          >
            {isSubmitting ? "Submitting..." : "Create Organization"}
          </button>

          <button
            type="button"
            className="px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
