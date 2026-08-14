"use client";
import React, { useRef, useState, useEffect } from "react";
import {
    ChevronDown, ShieldCheck, Users, Briefcase, Handshake, BarChart2, Check,
    Building2, FileText, MapPin, Globe, Upload,
} from "lucide-react";

const roles = [
    { value: "Admin", label: "Admin", icon: ShieldCheck, desc: "Full access to all settings and data" },
    { value: "HR", label: "HR", icon: Users, desc: "Manages people, leaves and attendance" },
    { value: "CEO", label: "CEO", icon: BarChart2, desc: "Executive-level oversight and reports" },
    { value: "Co-founder", label: "Co-founder", icon: Handshake, desc: "Shared ownership and strategic access" },
    { value: "Director", label: "Director", icon: Briefcase, desc: "Department-level management access" },
];

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white";
const labelCls = "block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
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

const Page = () => {
    const [selectedRole, setSelectedRole] = useState<(typeof roles)[0] | null>(null);
    const [open, setOpen] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const SelectedIcon = selectedRole?.icon;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Organization</h2>
                <p className="text-gray-400 text-sm mt-0.5">
                    Fill in the details below to set up your workspace.
                </p>
            </div>

            <form className="flex flex-col gap-y-1">

                {/* ── Identity ── */}
                <SectionHeader icon={Building2} title="Organization Identity" />

                {/* Logo upload */}
                <div className="mb-4">
                    <label className={labelCls}>Logo</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                        <Upload className="w-6 h-6 text-gray-300 group-hover:text-blue-400 mb-1 transition-colors" />
                        <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">Click to upload logo</span>
                        <span className="text-[10px] text-gray-300 mt-0.5">PNG, JPG up to 2 MB</span>
                        <input type="file" accept="image/*" className="hidden" />
                    </label>
                </div>

                <div className="mb-4">
                    <label className={labelCls}>Organization Name</label>
                    <input type="text" placeholder="e.g. Acme Corp" className={inputCls} />
                </div>

                {/* ── About ── */}
                <SectionHeader icon={FileText} title="About" />

                <div className="mb-4">
                    <label className={labelCls}>Description</label>
                    <textarea
                        rows={3}
                        placeholder="Brief description of what your organization does..."
                        className={`${inputCls} resize-none`}
                    />
                </div>

                {/* ── Location ── */}
                <SectionHeader icon={MapPin} title="Location" />

                <div className="mb-4">
                    <label className={labelCls}>Street Address</label>
                    <textarea rows={2} placeholder="e.g. 12 Business Park, Sector 5" className={`${inputCls} resize-none`} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className={labelCls}>Country</label>
                        <input type="text" placeholder="India" className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>State</label>
                        <input type="text" placeholder="Maharashtra" className={inputCls} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className={labelCls}>City</label>
                        <input type="text" placeholder="Mumbai" className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Pin Code</label>
                        <input type="text" placeholder="400001" className={inputCls} />
                    </div>
                </div>

                {/* ── Your Role ── */}
                <SectionHeader icon={Globe} title="Your Role" />

                <div ref={dropRef} className="w-full relative mb-6">
                    <label className={labelCls}>Select your role in this organization</label>

                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className={`w-full flex items-center justify-between gap-2 border rounded-xl px-4 py-3 text-sm transition-all focus:outline-none ${open
                                ? "border-blue-500 ring-2 ring-blue-500/20 bg-white"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                            }`}
                    >
                        {selectedRole ? (
                            <span className="flex items-center gap-2.5 text-gray-800 font-medium">
                                {SelectedIcon && (
                                    <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <SelectedIcon className="w-4 h-4 text-blue-600" />
                                    </span>
                                )}
                                {selectedRole.label}
                                <span className="text-xs text-gray-400 font-normal hidden sm:inline">— {selectedRole.desc}</span>
                            </span>
                        ) : (
                            <span className="text-gray-400 text-sm">Choose a role…</span>
                        )}
                        <ChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                    </button>
                    {open && (
                        <div className="absolute bottom-full mb-1.5 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-3 py-2 border-b border-gray-50">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                                    Select a role
                                </p>
                            </div>
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const isSelected = selectedRole?.value === role.value;
                                return (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => {
                                            setSelectedRole(role);
                                            setOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all group ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-blue-100" : "bg-gray-100 group-hover:bg-blue-50"
                                                }`}
                                        >
                                            <Icon
                                                className={`w-4 h-4 transition-colors ${isSelected
                                                        ? "text-blue-600"
                                                        : "text-gray-400 group-hover:text-blue-500"
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`text-sm font-semibold ${isSelected ? "text-blue-700" : "text-gray-800"
                                                    }`}
                                            >
                                                {role.label}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{role.desc}</p>
                                        </div>
                                        {isSelected && (
                                            <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-sm shadow-blue-200"
                    >
                        Create Organization
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
