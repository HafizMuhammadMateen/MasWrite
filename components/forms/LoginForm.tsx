"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateEmail, validatePassword } from "@/utils/validators";
import { FormErrors } from "@/utils/types";
import { FaEyeSlash, FaEye, FaGithub, FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import { getProviders, signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getProviders().then((res) => setProviders(res));
  }, []);

  if (!providers)
    return (
      <div className="flex justify-center items-center py-10">
        <span className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === "email") {
      const validationError = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: validationError }));
    } else if (name === "password") {
      const validationError = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: validationError }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation again on submit not just on blur
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Incorrect username or password!");

      const data = await response.json();
      console.log("Login successful:", data);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed!");
      setErrors((prev) => ({ ...prev, formError: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* <h2 className="text-2xl font-semibold text-center mb-4">Sign in to AuthX</h2> */}

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={email}
          placeholder="Enter your email"
          required
          autoComplete="email"
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block font-medium mb-1">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-gray-800 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Forgot Password */}
      <div className="text-right">
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || Boolean(errors.email) || Boolean(errors.password)}
        className={`w-full bg-gray-700 text-white rounded py-2 font-semibold flex justify-center items-center gap-2 transition ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900 cursor-pointer transition"
        }`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {/* Error */}
      {errors.formError && <p className="text-red-500 text-sm text-center">{errors.formError}</p>}

      {/* Divider */}
      <div className="flex items-center justify-center my-4">
        <div className="w-1/3 border-t border-gray-300"></div>
        <span className="mx-2 text-gray-500 text-sm">or</span>
        <div className="w-1/3 border-t border-gray-300"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-3 mt-6">
        {Object.values(providers).map((provider: any) => {
          const Icon =
            provider.name === "Google"
              ? FaGoogle
              : provider.name === "GitHub"
              ? FaGithub
              : null;

          return (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2 font-medium text-gray-700 hover:border-gray-800 transition-colors duration-200 cursor-pointer hover:shadow-sm"
            >
              {Icon && <Icon className="text-lg" />}
              {provider.name}
            </button>
          );
        })}
      </div>

      {/* Signup */}
      <p className="text-center text-sm text-gray-700 mt-4">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
