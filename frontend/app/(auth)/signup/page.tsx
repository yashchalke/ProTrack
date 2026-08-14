"use client";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { Check,XCircle } from "lucide-react";
import toast from "react-hot-toast";

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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "", color: "text-gray-400" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score, label: "Weak", color: "text-red-500" };
  } else if (score <= 4) {
    return { score, label: "Medium", color: "text-amber-500" };
  } else {
    return { score, label: "Strong", color: "text-green-500" };
  }
};

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
        const errorMsg = "Failed to connect to Auth Service";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.status && data.status !== 201) {
        const errorMsg = data.message || "Signup failed";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      console.log("Signup success:", data);
      toast.success("User Registered Successfully");

      // Reset form on success
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
      const errorMsg = err.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
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
            <div className="relative w-full">
              <input
                type="text"
                placeholder="First Name"
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formData.firstname.length >= 1 ? "focus:ring-blue-500/20 focus:border-blue-500" : "focus:ring-red-500/20 focus:border-red-500"} transition-all`}
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
              />
              {formData.firstname.length > 0 && (
                formData.firstname.length >= 1 ? (
                  <Check className="absolute right-3 top-2 text-green-500 w-5 h-5" />
                ) : (
                  <XCircle className="absolute right-3 top-2 text-red-500 w-5 h-5" />
                )
              )}
            </div>
            {errors.firstname && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstname}</p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Last Name"
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formData.lastname.length >= 1 ? "focus:ring-blue-500/20 focus:border-blue-500" : "focus:ring-red-500/20 focus:border-red-500"} transition-all`}
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
              />
              {formData.lastname.length > 0 && (
                formData.lastname.length >= 1 ? (
                  <Check className="absolute right-3 top-2 text-green-500 w-5 h-5" />
                ) : (
                  <XCircle className="absolute right-3 top-2 text-red-500 w-5 h-5" />
                )
              )}
            </div>
            {errors.lastname && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastname}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Email Address"
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${emailRegex.test(formData.email) ? "focus:ring-blue-500/20 focus:border-blue-500" : "focus:ring-red-500/20 focus:border-red-500"}  transition-all`}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {formData.email.length > 0 && (
              emailRegex.test(formData.email) ? (
                <Check className="absolute right-3 top-2 text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="absolute right-3 top-2 text-red-500 w-5 h-5" />
              )
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col w-full">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Phone Number"
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formData.phone_no.length >= 10 ? "focus:ring-blue-500/20 focus:border-blue-500" : "focus:ring-red-500/20 focus:border-red-500"} transition-all`}
              value={formData.phone_no}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/\D/g, "");
                if (cleanValue.length <= 10) {
                  setFormData({ ...formData, phone_no: cleanValue });
                }
              }}
            />
            {formData.phone_no.length > 0 && (
              formData.phone_no.length >= 10 ? (
                <Check className="absolute right-3 top-2 text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="absolute right-3 top-2 text-red-500 w-5 h-5" />
              )
            )}
          </div>
          {errors.phone_no && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone_no}</p>
          )}
        </div>

        <div className="flex flex-col w-full">
          <div className="relative w-full">
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${getPasswordStrength(formData.password).score >= 3 ? "focus:ring-blue-500/20 focus:border-blue-500" : "focus:ring-red-500/20 focus:border-red-500"} transition-all`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {formData.password.length > 0 && (
              getPasswordStrength(formData.password).score >= 3 ? (
                <Check className="absolute right-3 top-2 text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="absolute right-3 top-2 text-red-500 w-5 h-5" />
              )
            )}
          </div>
          {formData.password.length > 0 && (
            <div className="mt-1.5 flex flex-col gap-1">
              <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    getPasswordStrength(formData.password).label === "Weak"
                      ? "w-1/3 bg-red-500"
                      : getPasswordStrength(formData.password).label === "Medium"
                      ? "w-2/3 bg-amber-500"
                      : "w-full bg-green-500"
                  }`}
                />
              </div>
              <span className={`text-[11px] font-medium ${getPasswordStrength(formData.password).color}`}>
                Password Strength: {getPasswordStrength(formData.password).label}
              </span>
            </div>
          )}
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col w-full">
          <div className="relative w-full">
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${(formData.confirmPassword.length >= 6 && formData.confirmPassword === formData.password) ? "focus:ring-blue-500/20 focus:border-blue-500" : "focus:ring-red-500/20 focus:border-red-500"} transition-all`}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {formData.confirmPassword.length > 0 && (
              (formData.confirmPassword.length >= 6 && formData.confirmPassword === formData.password) ? (
                <Check className="absolute right-3 top-2 text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="absolute right-3 top-2 text-red-500 w-5 h-5" />
              )
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="text-center mt-2">
          <button
            className="bg-blue-800 w-full py-2.5 rounded-lg text-white font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
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
