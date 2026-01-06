"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validateUsername, validateEmail, validatePassword } from "@/utils/validators";
import { FormErrors } from "@/utils/types";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { signupSchema } from "@/lib/validation/zodSchemas";
import { z } from "zod";

export default function SignupForm() {
  const isDev = process.env.NODE_ENV === "development";

  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "userName") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  }

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Dynamically pick the schema for the single field
    const fieldSchema = signupSchema.pick({ [name]: true } as any);
    const result = fieldSchema.safeParse({ [name]: value });

    if (!result.success) {
      const { fieldErrors }: any = z.flattenError(result.error);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name]?.[0]}));
    } else {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate with Zod
      const result = signupSchema.safeParse({ userName, email, password });

      if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);
        setErrors({
          userName: fieldErrors.userName?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
        return;
      }

      setErrors({}); // Clear previous errors

      isDev && console.log("[SignupForm Page] Form submitted with:", result.data);

      // Send data to backend
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ userName, email, password }),
        // credentials: "include" // No need in signup page bcz cookies are not setting in signup page
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Something went wrong!");
      }

      const data = await response.json();
      isDev && console.log("[SignupForm Page] Signup successful:", data);

      toast.success("Signup successful! Please log in.");
      router.push("/login");

    } catch (err: any) {
      // ✅ 4. Handle network or backend errors
      const message = err instanceof Error ? err.message : "Signup failed!";
      toast.error(message);
      setErrors((prev) => ({ ...prev, formError: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>Username</label>
      <input 
        name="userName"
        type="text"
        value={userName}
        placeholder="Username"
        autoComplete="off"
        required
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded px-3 py-2 focus-visible:ring-gray-900"
      />

      {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}

      <label>Email</label>
      <input
        name="email"
        type="email"
        value={email}
        placeholder="Email"
        autoComplete="email"
        required
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded px-3 py-2 focus-visible:ring-gray-900"
      />

      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <label>Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            required
            autoComplete="current-password"
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus-visible:ring-gray-900"         
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-gray-900"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
      </div>

      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <button
        type="submit"
        disabled={loading || Boolean(errors.userName) || Boolean(errors.email) || Boolean(errors.password)}
        className={`w-full bg-gray-700 text-white rounded py-2 font-semibold flex justify-center items-center gap-2
          ${loading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-900 cursor-pointer transition" }`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Signing up...
          </>

        ) : (
          "Signup"
        )}
      </button>

      {errors.formError && <p className="text-red-500 text-sm">{errors.formError}</p>}

      <p>
        Already have an account? Login
        <Link 
        href="/login"
        className="text-blue-500 font-semibold"
        > here
        </Link>
      </p>
    </form>
  )
}