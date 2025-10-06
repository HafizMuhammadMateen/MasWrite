"use client"
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // get ?token=... from URL
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push("/login");
  }

  return (
    <div>
      <ChangePasswordModal
        isOpen={isOpen}
        onClose={handleClose}
        isResetFlow={true}
        token={token} // pass token if your modal needs it
      />
    </div>
  )
}
