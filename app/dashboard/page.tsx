"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import toast from "react-hot-toast";
import { Blog } from "@/lib/types/blog";
import Link from "next/link";
import BlogCard from "@/components/blogs/BlogCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/dashboard/ProfileCard";
import RecentBlogs from "@/components/dashboard/RecentBlogs";


export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  // Redirect if unauthorized
  useEffect(() => {
    if (data?.error) {
      setTimeout(() => router.push("/login"), 800);
    }
  }, [data, router]);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include", // ensures cookies are sent
        });

        if (!res.ok) {
          const errData = await res.json();
          toast.error(errData.error || "Unauthorized access");
          setData({ error: errData.error || "Unauthorized" });
          return;
        }

        const result = await res.json();
        setData(result.data);
        toast.success("Dashboard loaded successfully");
      } catch {
        toast.error("Failed to load dashboard");
        setData({ error: "Failed to load dashboard" });
      }
    }
    fetchDashboard();
  }, []);

  // Fetch blogs
  useEffect(() => {
    fetch("/api/blogs")
    .then((res) => res.json())
    .then((data) => setBlogs(data.blogs || []));
  }, []);

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

  // Loading state
  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <span className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></span>
        <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  // Redirecting state
  if (data?.error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />

      <main className="flex flex-1 ">
        {/* Left Sidebar - Profile */}
        {/* <aside className="w-full md:w-1/4 bg-white shadow-md p-6 border-r border-gray-200 flex flex-col"> */}
        <aside className="bg-white flex flex-row">
          <ProfileCard userName={data.user?.userName} email={data.user?.email} />
        </aside>

        {/* Right Section - Blogs */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 my-4 text-center">Recent Blog Posts</h2>
            <section className="shadow-md rounded-lg max-h-[calc(100vh-150px)] p-6">
              <RecentBlogs blogs={blogs} />
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );

}