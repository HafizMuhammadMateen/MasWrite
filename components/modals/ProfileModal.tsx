"use client";

import Link from "next/link";
import { KeyRound, LogOut, Settings, User } from "lucide-react";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(/[\s_]+/)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

interface ProfileModalProps {
  user?: {
    name?: string;
    userName?: string;
    email?: string;
  };
  onClose: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

export default function ProfileModal({ user, onClose, onChangePassword, onLogout }: ProfileModalProps) {
  const displayName = user?.userName || user?.name || "Unknown User";
  const initials = getInitials(displayName);

  return (
    <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-100/80 z-50 overflow-hidden">
      {/* User info header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email || "No email"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-1.5">
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
        >
          <Settings className="w-4 h-4 shrink-0 text-gray-400" />
          Settings
        </Link>
        <button
          onClick={onChangePassword}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left cursor-pointer"
        >
          <KeyRound className="w-4 h-4 shrink-0 text-gray-400" />
          Change Password
        </button>
      </div>

      <div className="border-t border-gray-100 p-1.5">
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
