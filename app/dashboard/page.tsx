"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Blog } from "@/lib/types/blog";
import RecentBlogs from "@/components/dashboard/RecentBlogs";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
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
      <main className="flex flex-1 ">
        {/* Blogs */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 my-4 text-center">Recent Blog Posts</h2>
            <section className="shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] max-h-[calc(100vh-150px)] p-6">
              <RecentBlogs blogs={blogs} />
            </section>
        </div>
      </main>
    </div>
  );

}