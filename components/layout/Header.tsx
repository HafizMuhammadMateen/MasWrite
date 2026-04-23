"use client";

import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import ProfileModal from "@/components/modals/ProfileModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { useLogout } from "@/hooks/useLogout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Header() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleLogout = useLogout();
  const user = useCurrentUser();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowProfileModal(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowProfileModal(false);
    };
    if (showProfileModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showProfileModal]);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm w-full">
      <div className="flex items-center gap-3">
        <Link href="/" className="font-semibold text-xl px-14">
          MasWrite
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setShowProfileModal((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <FaUserCircle size={26} />
        </button>

        {showProfileModal && (
          <div ref={modalRef}>
            <ProfileModal
              user={user ?? undefined}
              onClose={() => setShowProfileModal(false)}
              onChangePassword={() => {
                setShowProfileModal(false);
                setShowChangePasswordModal(true);
              }}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </header>
  );
}
