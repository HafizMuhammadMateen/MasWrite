"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProfileModal from "@/components/modals/ProfileModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { useLogout } from "@/hooks/useLogout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(/[\s_]+/)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function Header() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleLogout = useLogout();
  const user = useCurrentUser();
  const initials = getInitials(user?.userName || user?.name);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setShowProfileModal(false);
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
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-100 shrink-0 z-30">
      {/* Brand — visible only when sidebar is too narrow to show it */}
      <div className="w-[60px]" />

      {/* Centre search */}
      <div className="flex-1 max-w-sm mx-4 hidden sm:block">
        <input
          type="text"
          placeholder="Search…"
          className="w-full h-8 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>

      {/* Right: avatar */}
      <div className="relative">
        <button
          onClick={() => setShowProfileModal((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer group"
          aria-label="Open profile menu"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary/30 transition">
            {initials}
          </div>
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
