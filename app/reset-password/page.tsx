"use client"
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import {jwtDecode} from "jwt-decode";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // get ?token=... from URL
  const [isOpen, setIsOpen] = useState(false);
  const[errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    if(!token) {
      setTimeout(() => {
        setErrorMsg("❌ Invalid or missing password reset link.");
        setIsOpen(false);

        // show message for 3s, then redirect
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      });
      return;
    } else {
      setIsOpen(true);
    }

    try {
      // decode token to get expiry timestamp
      const decoded = jwtDecode<{ exp: number }>(token);
      const timeLeft = decoded.exp * 1000 - Date.now();

      if (timeLeft <= 0) {
        setTimeout(() => {
          setErrorMsg("❌ Invalid or missing password reset link.");
          setIsOpen(false);

          // show message for 3s, then redirect
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        });
        return;
      }

      // open modal if token valid
      setIsOpen(true);

      const timer = setTimeout(() => {
        setErrorMsg("❌ Password reset link has expired.");
        setIsOpen(false);

        // show message for 3s, then redirect
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }, timeLeft);

      return () => clearTimeout(timer);

    } catch (err) {
      setErrorMsg("❌ Invalid password reset token.");
      setIsOpen(false);
    }
  }, [token]);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/login");
  }

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
  )
}
