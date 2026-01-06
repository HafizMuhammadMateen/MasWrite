"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { jwtDecode } from "jwt-decode";

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setErrorMsg("❌ Invalid or missing password reset link.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const timeLeft = decodedToken.exp * 1000 - Date.now();

      if (timeLeft <= 0) {
        setErrorMsg("❌ Password reset link expired.");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      setIsOpen(true);

      const timer = setTimeout(() => {
        setErrorMsg("❌ Password reset link expired.");
        setIsOpen(false);
        setTimeout(() => router.push("/login"), 3000);
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch {
      setErrorMsg("❌ Invalid password reset token.");
      setIsOpen(false);
    }
  }, [token]);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div>
      {errorMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="font-medium">{errorMsg}</p>
          </div>
        </div>
      )}
      <ChangePasswordModal
        isOpen={isOpen}
        onClose={handleClose}
        isResetFlow={true}
        token={token}
      />
    </div>
  );
}
