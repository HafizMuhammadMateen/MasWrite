"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/utils/validators";
import { ChangePasswordModalProps } from "../../utils/types"

export default function ChangePasswordModal({ isOpen, onClose, isResetFlow = false, token }: ChangePasswordModalProps) {
  const[currentPassword, setCurrentPassword] = useState("");
  const[newPassword, setNewPassword] = useState("");
  const[confirmPassword, setConfirmPassword] = useState("");
  const[loading, setLoading] = useState(false);
  const[errors, setErrors] = useState<{currentPassword?:string, newPassword?:string, confirmPassword?:string, formError?:string}>({});
  const router = useRouter();
  // console.log("is this a reset flow (Token arrived)?:", isResetFlow);

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
    let currentPasswordError = "";
    if(!isResetFlow) currentPasswordError = validatePassword(currentPassword, true);
    const newPasswordError = validatePassword(newPassword, true);
    const confirmPasswordError = validatePassword(confirmPassword, true);

    if(currentPasswordError || newPasswordError || confirmPasswordError) {
      setErrors({
        ...(isResetFlow? {} : {currentPassword: currentPasswordError}), 
        newPassword: newPasswordError, 
        confirmPassword: confirmPasswordError});
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

      const url = isResetFlow ? "/api/auth/reset-password" : "/api/auth/change-password";
      const body = isResetFlow
      ? { token, newPassword }
      : { currentPassword, newPassword };
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(body),
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
      setErrors((prev) => ({ ...prev, formError: err.message}));
      if (err.message.includes("expired")) {
        alert("Your reset link has expired. Please request a new one.");
        router.push("/forgot-password");
}

    } finally {
      setLoading(false);
    }

  }

  const handleCancel = () => {
    onClose();
    if(isResetFlow) router.push("/login"); // Forgot(reset) password flow
    else onClose(); // if user was logged in (just close the opened modal)
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
              autoComplete="current-password"
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