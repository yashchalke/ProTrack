"use client";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";

const signupSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_no: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Page = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});

    const result = signupSchema.safeParse(formData);
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
      const { firstname, lastname, email, phone_no, password } = formData;
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname, lastname, email, phone_no, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to Auth Service");
      }

      const data = await response.json();
      
      if (data.status && data.status !== 201) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup success:", data);
      window.alert("User Registered Successfully");

      // Reset form
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone_no: "",
        password: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Get Started Now</h1>
        <p className="text-gray-500 text-sm mt-1">Please register to get started</p>
      </div>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex flex-col w-full">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
            {errors.firstname && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstname}</p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
            {errors.lastname && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastname}</p>
            )}
          </div>
        </div>

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
            type="text"
            placeholder="Phone Number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.phone_no}
            onChange={(e) =>
              setFormData({ ...formData, phone_no: e.target.value })
            }
          />
          {errors.phone_no && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone_no}</p>
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

        <div className="flex flex-col w-full">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="text-center mt-2">
          <button
            className="bg-blue-800 w-full py-2.5 rounded-lg text-white font-medium hover:bg-blue-900 transition-colors hover:cursor-pointer text-sm shadow-sm"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-gray-500 mt-3 text-sm">
            Already have an account?{" "}
            <Link href={"/login"} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Page;
