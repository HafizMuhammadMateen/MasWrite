"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Header() {
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Auth-Module Blogs
        </Link>

        <nav className="flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/blogs" className="hover:text-blue-600 transition">Blogs</Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        </nav>

        <button
          onClick={() => handleLogout()}
          className="bg-red-500 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-red-600  transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
