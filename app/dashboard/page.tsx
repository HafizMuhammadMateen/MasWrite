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
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  //     <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
  //       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
  //         Dashboard
  //       </h1>

  //       <div className="flex flex-col items-center mt-6 bg-gray-100 rounded-lg p-4 shadow-inner text-center">
  //         <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
  //           {data.user?.userName?.charAt(0)?.toUpperCase()}
  //         </div>
  //         <p className="text-xl font-semibold text-gray-800 mt-3">
  //           👋 Welcome, <span className="text-blue-600">{data.user?.userName}</span>
  //         </p>
  //         <p className="text-gray-600 mt-1">{data.user?.email}</p>
         
  //         <Link
  //           href="/dashboard/blogs"
  //           className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
  //         >
  //           View Blogs
  //         </Link>
  //       </div>

  //       <button
  //         type="reset"
  //         onClick={() => setIsModalOpen(true)}
  //         className="mt-8 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer transition"
  //       >
  //         Change Password
  //       </button>

  //       <ChangePasswordModal
  //         isOpen={isModalOpen}
  //         onClose={() => setIsModalOpen(false)}
  //       />

  //       <button
  //         type="reset"
  //         onClick={handleLogout}
  //         className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 cursor-pointer transition"
  //       >
  //         Logout
  //       </button>
  //     </div>

  //     {/* Recent Blogs */}
  //     <section className="mt-10">
  //       <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
  //         Recent Blog Posts
  //       </h2>

  //       {posts.length === 0 ? (
  //         <p className="text-gray-500 text-center">No blog posts yet.</p>
  //       ) : (
  //         <ul className="space-y-3">
  //           {/* {posts.map((p) => (
  //             <li key={p._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm">
  //               <p className="font-semibold text-gray-800">{p.title}</p>
  //               <p className="text-gray-600 text-sm mt-1 line-clamp-2">{p.content}</p>
  //             </li>
  //           ))} */}
  //           {posts.map(post => (
  //             <BlogCard
  //               key={post._id}
  //               title={post.title}
  //               excerpt={post.content}
  //               slug={post.slug}
  //               authorName={typeof post.author === "string" ? post.author : post.author.userName}
  //               publishedAt={post.publishedAt}
  //               readingTime={post.readingTime}
  //               views={post.views}
  //               tags={post.tags}
  //             />
  //           ))}
  //         </ul>
  //       )}
  //     </section>

  //   </div>
  // );
  
  //  return (
  //   <div className="min-h-screen bg-gray-50">
  //     {/* Header */}
  //     <header className="bg-white shadow-sm py-4">
  //       <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
  //         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
  //         <div className="flex items-center gap-3">
  //           <button
  //             onClick={() => setIsModalOpen(true)}
  //             className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition"
  //           >
  //             Change Password
  //           </button>
  //           <button
  //             onClick={() => handleLogout()}
  //             className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
  //           >
  //             Logout
  //           </button>
  //         </div>
  //       </div>
  //     </header>

  //     {/* Main content */}
  //     <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
  //       {/* Left Column: Profile */}
  //       <section className="bg-white rounded-lg shadow p-6 text-center">
  //         <div className="w-20 h-20 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
  //           {data.user?.userName?.charAt(0)?.toUpperCase()}
  //         </div>
  //         <h2 className="text-xl font-semibold mt-3 text-gray-800">
  //           {data.user?.userName}
  //         </h2>
  //         <p className="text-gray-500">{data.user?.email}</p>
  //         <Link
  //           href="/dashboard/blogs"
  //           className="mt-5 inline-block bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition"
  //         >
  //           Manage Blogs
  //         </Link>
  //       </section>

  //       {/* Right Column: Recent Blogs */}
  //       <section className="md:col-span-2">
  //         <h2 className="text-xl font-semibold text-gray-800 mb-4">
  //           Recent Blog Posts
  //         </h2>

  //         {blogs.length === 0 ? (
  //           <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
  //             No blog posts yet.
  //           </div>
  //         ) : (
  //           <div className="grid gap-4">
  //             {blogs.map((blog) => (
  //               <BlogCard
  //                 key={blog._id}
  //                 title={blog.title}
  //                 excerpt={blog.content}
  //                 slug={blog.slug}
  //                 authorName={
  //                   typeof blog.author === "string"
  //                     ? blog.author
  //                     : blog.author.userName
  //                 }
  //                 publishedAt={blog.publishedAt}
  //                 readingTime={blog.readingTime}
  //                 views={blog.views}
  //                 tags={blog.tags}
  //               />
  //             ))}
  //           </div>
  //         )}
  //       </section>
  //     </main>

  //     {/* Modals */}
  //     <ChangePasswordModal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //     />
  //   </div>
  // );

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
            <section className="overflow-auto shadow-md rounded-lg max-h-[calc(100vh-150px)] p-2">
              <RecentBlogs blogs={blogs} />
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );

}