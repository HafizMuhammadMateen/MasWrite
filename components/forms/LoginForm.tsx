"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateEmail, validatePassword } from "@/utils/validators";
import { FormErrors } from "@/utils/types"; // for type defination
import { FaEyeSlash, FaEye } from "react-icons/fa";
// import { resolve } from "path";
// import bcrypt from "bcryptjs";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const[showPassword, setShowPassword] = useState(false);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name === "email") {
      setEmail(e.target.value);
    } else if(e.target.name === "password") {
      setPassword(e.target.value);
    }
  }

  const handleBlur = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name === "email") {
      const validationError = validateEmail(email);
      setErrors((prev) => ({...prev, email: validationError}));
    } else if(e.target.name === "password") {
      const validationError = validatePassword(password);
      setErrors((prev) => ({...prev, password: validationError}));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation again on submit not just on blur
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if(emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors(() => ({}));
    console.log("Form submitted with:", { email, password });
    
    try {
      setLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 3000));
      const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json"},
      body: JSON.stringify({ email, password }),
      credentials: "include" // inlcude cookies in fetch [to avoid using localstorage]
    });

    if(!response.ok) {
      throw new Error("Incorrect username or password!");
    }

    const data = await response.json();
    console.log("Login successful:", data);
    
    // localStorage.setItem("token", data.token);
    router.push("/dashboard");

    } catch(err:any) {
      // backend error message
      setErrors((prev) => ({ ...prev, formError: err.message}));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={email}
          placeholder="Email"
          required
          autoComplete="email"
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

        <p><Link 
          href="/forgot-password"
          className="text-decoration-line: underline"
        >Forgot Password?
        </Link></p>

        <button 
          type="submit"
          disabled={loading || Boolean(errors.email) || Boolean(errors.password)}
          className={`w-full bg-gray-700 text-white rounded py-2 font-semibold flex justify-center items-center gap-2
            ${loading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-900 cursor-pointer transition"} `}
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

        {errors.formError && <p className="text-red-500 text-sm">{errors.formError}</p>}

        <p>
          Don't have an Account? Signup
          <Link 
            href={"/signup"}
            className="text-blue-500 font-semibold"
          > here
          </Link>
        </p>
    </form>
  )
}