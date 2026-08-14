"use client";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Check,XCircle } from "lucide-react";
import toast from "react-hot-toast";

const loginschema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});

    const result = loginschema.safeParse(formData);

    if(!result.success){
      const fieldErrors : Record<string,string> = {};
      result.error.issues.forEach((issue)=>{
        if(issue.path && issue.path[0]){
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return
    }

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMsg = "Invalid credentials or server error";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.status && data.status !== 200) {
        const errorMsg = data.message || "Invalid credentials";
        setError(errorMsg);
        toast.error(errorMsg);
        // Clear password but keep email so the user doesn't have to retype it
        setFormData((prev) => ({ ...prev, password: "" }));
        setLoading(false);
        return;
      }

      console.log("Login success:", data);
      toast.success("Logged in Successfully");
      // Reset form on success
      setFormData({
        email: "",
        password: "",
      });
      router.push('/onboarding');
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMsg = err.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="text-black w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Welcome Back!</h1>
        <p className="text-gray-500 text-sm mt-1">Please log in to get started</p>
      </div>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col w-full">
          <div className="relative w-full">
          <input
            type="text"
            placeholder="Email Address"
            className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 
              ${formData.email.length === 0 ? "focus:border-red-500 focus:ring-red-500/20" : emailRegex.test(formData.email) ? "focus:border-green-500 focus:ring-green-500/20" : "focus:border-red-500 border-red-400 focus:ring-red-500/20"} focus:outline-none focus:ring-2 transition-all`}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {formData.email.length > 0 && (
            emailRegex.test(formData.email) ? (<Check className="absolute right-3 top-2 text-green-500 w-5 h-5" />) : 
            (<XCircle className="absolute right-3 top-2 text-red-500 w-5 h-5" />))}
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
          )}
        </div>
        </div>

        <div className="flex flex-col w-full">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
          )}
        </div>

        <div className="text-center mt-2">
          <button
            className="bg-blue-800 w-full py-2.5 rounded-lg text-white font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-gray-500 mt-3 text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/signup"} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Page;