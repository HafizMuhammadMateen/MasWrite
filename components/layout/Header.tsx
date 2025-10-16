"use client";

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "@/components/modals/ProfileModal";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm">
      {/* Left: Navbar toggle + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-100 transition cursor-pointer"
        >
          <FaBars size={20} />
        </button>
        <span className="font-semibold text-lg">Dashboard</span>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-md mx-4">
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
          className="p-2 rounded-full hover:bg-gray-100"
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
