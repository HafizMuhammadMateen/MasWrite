"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Home, Edit, Settings, LogOut, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();

  // Handle logout
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
    <div className="flex flex-col h-full p-4 space-y-3 bg-gray-50 shadow text-lg">
      {/* New Post */}
      <Button className="flex items-center gap-2 my-4 rounded-full px-4 py-5 cursor-pointer text-lg" variant="default">
        <Plus className="w-4 h-4" /> New Post
      </Button>

      <Separator />

      {/* Menu buttons */}
      <div className="flex flex-col gap-2 flex-1 text-lg">
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-3 rounded hover:bg-gray-200 active:text-blue-600  transition-colors">
          <Home className="w-4 h-4" /> Dashboard
        </Link>
        <Link href="/dashboard/blogs" className="flex items-center gap-2 px-3 py-3 rounded hover:bg-gray-200 transition-colors">
          <Edit className="w-4 h-4" /> Manage Blogs
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-3 rounded hover:bg-gray-200 transition-colors">
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </div>

      {/* Logout */}
      <button 
        onClick={() => handleLogout()}
        className="flex items-center gap-2 px-3 py-2 rounded text-red-500 hover:bg-gray-200 active:text-blue-600 transition-colors mt-auto cursor-pointer">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}
