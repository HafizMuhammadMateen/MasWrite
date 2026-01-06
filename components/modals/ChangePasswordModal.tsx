"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/utils/validators";
import { ChangePasswordModalProps } from "../../utils/types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FormErrors } from "@/utils/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ChangePasswordModal({ isOpen, onClose, isResetPasswordFlow = false, token }: ChangePasswordModalProps) {
  const[currentPassword, setCurrentPassword] = useState("");
  const[newPassword, setNewPassword] = useState("");
  const[confirmPassword, setConfirmPassword] = useState("");
  const[loading, setLoading] = useState(false);
  const[errors, setErrors] = useState<FormErrors>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "currentPassword") setCurrentPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);

    const validationError = validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validationError = validatePassword(value, true);
    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let currentPasswordError = null;
    if(!isResetPasswordFlow) currentPasswordError = validatePassword(currentPassword, true);
    const newPasswordError = validatePassword(newPassword, true);
    const confirmPasswordError = validatePassword(confirmPassword, true);

    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      setErrors({
        ...(isResetPasswordFlow? {} : {currentPassword: currentPasswordError || undefined}), 
        newPassword: newPasswordError || undefined, 
        confirmPassword: confirmPasswordError || undefined,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, formError: "Passwords do not match" }));
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      setLoading(true);

      const url = isResetPasswordFlow ? "/api/auth/reset-password" : "/api/auth/change-password";
      const body = isResetPasswordFlow
      ? { token, newPassword }
      : { currentPassword, newPassword };
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to change password!");
      }

      alert("Password changed successfully, please login again.");
      onClose();
      router.push("/login");
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, formError: err.message }));
      if (err.message.includes("expired")) {
        alert("Your reset link has expired. Please request a new one.");
        router.push("/forgot-password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isResetPasswordFlow) router.push("/login");
    else onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {!isResetPasswordFlow && (
            <div>
              <label>Current Password</label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  placeholder="Current password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-gray-900"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>
          )}

          <div>
            <label>New Password</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                placeholder="New password"
                autoComplete="new-password"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-gray-900"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
          </div>

          <div>
            <label>Confirm New Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-gray-900"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.formError && <p className="text-red-500 text-sm">{errors.formError}</p>}

          <DialogFooter className="flex flex-col gap-2 mt-8">
            <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="w-full text-md flex-1 cursor-pointer"
            >
            Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={
                loading ||
                Boolean(errors.currentPassword) ||
                Boolean(errors.newPassword) ||
                Boolean(errors.confirmPassword)
              }
              className="w-full flex-1 justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
