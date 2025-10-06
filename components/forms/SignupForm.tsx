"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validateUsername, validateEmail, validatePassword } from "@/utils/validators";
import { FormErrors } from "@/utils/types"; // for type defination
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function SignupForm() {
  const[email, setEmail] = useState("");
  const[userName, setUsername] = useState("");
  const[password, setPassword] = useState("");
  const[loading, setLoading] = useState(false);
  const[errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const[showPassword, setShowPassword] = useState(false);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name === "userName") {
      setUsername(e.target.value);
    } else if(e.target.name === "email") {
      setEmail(e.target.value);
    } else if(e.target.name === "password") {
      setPassword(e.target.value);
    }
  }

  const handleBlur = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name === "userName") {
      const validationError = validateUsername(e.currentTarget.value);
      setErrors((prev) => ({...prev, userName: validationError}));
    } else if(e.target.name === "email") {
      const validationError = validateEmail(e.target.value);
      setErrors((prev) => ({...prev, email: validationError}));
    } else if(e.target.name === "password") {
      const validationError = validatePassword(e.target.value, true); //calling strict check for signup page
      setErrors((prev) => ({...prev, password: validationError}));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation again on submit not just on blur
    const userNameError = validateUsername(userName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, true);

    if(userNameError || emailError || passwordError) {
      setErrors({userName: userNameError, email: emailError, password: passwordError});
      return;
    }
    
    setErrors({});
    // setErrors({ email: "", userName: "", password: "" });
    console.log("Form submitted with: ", {userName, email, password});

    try {
      setLoading(true);
      
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({ userName, email, password }),
        // credentials: "include" // No need in signup page bcz cookies are not setting in signup page
      })

      if(!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Some thing went wrong!");
      }

      const data = await response.json();
      console.log("Signup successful:", data);

      router.push("/login");

    } catch(err:any) {
      // backend error message
      setErrors((prev) => ({ ...prev, formError: err.message}))
    } finally {
      setLoading(false);
    }

  }

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