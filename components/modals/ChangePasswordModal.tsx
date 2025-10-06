"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/utils/validators";
import { ChangePasswordModalProps } from "../../utils/types"

export default function ChangePasswordModal({ isOpen, onClose, token }: ChangePasswordModalProps) {
  const[currentPassword, setCurrentPassword] = useState("");
  const[newPassword, setNewPassword] = useState("");
  const[confirmPassword, setConfirmPassword] = useState("");
  const[loading, setLoading] = useState(false);
  const[errors, setErrors] = useState<{currentPassword?:string, newPassword?:string, confirmPassword?:string, formError?:string}>({});
  const router = useRouter();
  const isResetFlow = Boolean(token);
  console.log("Token arrived:", isResetFlow);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name === "currentPassword") setCurrentPassword(e.target.value);
    else if(e.target.name === "newPassword")  setNewPassword(e.target.value);
    else if(e.target.name === "confirmPassword")  setConfirmPassword(e.target.value);
  }

  const handleBlur = (e:React.ChangeEvent<HTMLInputElement>) => {
    const validationError = validatePassword(e.target.value, true); //calling strict check for new password
    setErrors((prev) => ({...prev, [e.target.name]: validationError}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation again on submit not just on blur
    const currentPasswordError = validatePassword(currentPassword, true);
    const newPasswordError = validatePassword(newPassword, true);
    const confirmPasswordError = validatePassword(confirmPassword, true);

    if(currentPasswordError || newPasswordError || confirmPasswordError) {
      setErrors({currentPassword: currentPasswordError, newPassword: newPasswordError, confirmPassword: confirmPasswordError});
      return;
    }

    if(newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, formError: "Passwords do not match"}))
      return;
    }
    
    setErrors({});
    // setErrors({ email: "", userName: "", password: "" });

    try {
      setLoading(true);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({ currentPassword, newPassword }),
        // body: JSON.stringify(isResetFlow ? { newPassword, token } : { currentPassword, newPassword }),
        // credentials: "include" // No need in signup page bcz cookies are not setting in signup page
      })

      if(!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to change password!");
      }

      //On sccess
      console.log("Password Changed: ", {currentPassword}, "->", {newPassword});
      alert("Password changed successfully, Please login again.")
      onClose();
      const data = await response.json();
      console.log("Password changed successfull:", data);

      router.push("/login");

    } catch(err:any) {
      // backend error message
      setErrors((prev) => ({ ...prev, formError: err.message}))
    } finally {
      setLoading(false);
    }

  }

  const handleCancel = () => {
    onClose();
    router.push("/login");
  }

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl text-center font-semibold mb-4">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isResetFlow && (
            <>
            <label>Current Password</label>
            <input 
              name="currentPassword"
              type="password"
              value={currentPassword}
              placeholder="Current password"
              autoComplete="off"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border border-gray-300 rounded px-3 py-2 focus-visible:ring-gray-900"
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
          </>
          )}

          <label>New Password</label>
          <input
          name="newPassword"
          type="password"
          value={newPassword}
          placeholder="New password"
          autoComplete="new-password"
          required
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded px-3 py-2 focus-visible:ring-gray-900"
          />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}

          <label>Confirm New Password</label>
          <input 
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          placeholder="Confirm password"
          autoComplete="new-password"
          required
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded px-3 py-2 focus-visible:ring-gray-900"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-400 text-white rounded py-2 font-semibold cursor-pointer hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || Boolean(errors.currentPassword) || Boolean(errors.newPassword) || Boolean(errors.confirmPassword)}
            className="w-full bg-blue-600 text-white rounded py-2 font-semibold cursor-pointer hover:bg-blue-700 transition"
          >
            {loading? "Changing..." : "Change Password"}
          </button>
          {errors.formError && <p className="text-red-500 text-sm">{errors.formError}</p>}
        </form>
      </div>
    </div>
  )
}