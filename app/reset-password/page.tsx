"use client"
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // get ?token=... from URL
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const[errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if(!token) {
      setErrorMsg("❌ Invalid or missing password reset link.");
      setIsOpen(false);
    } else {
      setIsOpen(true);
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
