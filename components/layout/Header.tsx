"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "@/components/modals/ProfileModal";
import Link from "next/link";

export default function Header() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm w-full">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="font-semibold text-xl px-14">Auth-Module</Link>
      </div>

      {/* Middle: Search bar (hidden on small screens) */}
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
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <FaUserCircle size={26} />
        </button>

        {showProfileModal && (
          <ProfileModal onClose={() => setShowProfileModal(false)} />
        )}
      </div>
    </header>
  );
}
