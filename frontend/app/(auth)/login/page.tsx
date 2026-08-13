"use client";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";

const loginschema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});

    const result = loginschema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path && issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
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
        throw new Error("Invalid credentials or server error");
      }

      const data = await response.json();
      
      if (data.status && data.status !== 200) {
        throw new Error(data.message || "Invalid credentials");
      }

      console.log("Login success:", data);
      window.alert("Logged in Successfully");
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setFormData({
        email: "",
        password: "",
      })
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
          <input
            type="text"
            placeholder="Email Address"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
          )}
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
            className="bg-blue-800 w-full py-2.5 rounded-lg text-white font-medium hover:bg-blue-900 transition-colors hover:cursor-pointer text-sm shadow-sm"
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