"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/utils/validators";
import type { FormErrors } from "@/utils/types";

export default function ForgotPassword() {
  const[email, setEmail] = useState("");
  const[loading, setLoading] = useState(false);
  const[errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const[success, setSuccess] = useState(false);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleBlur = (e:React.ChangeEvent<HTMLInputElement>) => {
    const validationError = validateEmail(e.target.value);
    setErrors((prev) => ({...prev, email: validationError}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation again on submit not just on blur
    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError})
      return;
    }
    
    setErrors({});
    setSuccess(false);

    try {
      setLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({ email }),
        // credentials: "include" // No need in signup page bcz cookies are not setting in signup page
      })

      if(!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Invalid Email!");
      }

      //On sccess
      setSuccess(true);
      
    } catch(err:any) {
      // backend error message
      setErrors((prev) => ({ ...prev, formError: err.message}))
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl text-center font-semibold mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label>Enter your Email</label>
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

          <button
            type="button"
            onClick={router.back}
            className="w-full bg-gray-400 text-white rounded py-2 font-semibold cursor-pointer hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || Boolean(errors.email)}
            className={`w-full bg-blue-600 text-white rounded py-2 font-semibold flex justify-center items-center gap-2
              ${loading ? "opacity-75 cursor-not-allowed" : "cursor-pointer hover:bg-blue-700 transition"}`}
          >
            {loading? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </>
            ) : (
              "Send Code link"
            )}
          </button>

          {errors.formError && <p className="text-red-500 text-sm">{errors.formError}</p>}
          {success && (
            <div className="border border-gray-200 mt-3 pt-3 bg-green-50 p-2 rounded">
              <p className="text-green-700 text-sm text-center">
                A password reset link has been sent to your email. Please check your inbox.
              </p>
            </div>
          )}         
        </form>
      </div>
    </div>
  )
}