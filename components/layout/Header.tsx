"use client";

import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ProfileModal from "@/components/modals/ProfileModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

export default function Header() {
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Close profile modal on outside click or Esc
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

  // Logout handler
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Logout failed, please try again");
      }
    } catch {
      toast.error("Something went wrong while logging out");
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm w-full">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="font-semibold text-xl px-14">
          Auth-Module
        </Link>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {/* Right: Profile Icon */}
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
              user={user}
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </header>
  );
}
