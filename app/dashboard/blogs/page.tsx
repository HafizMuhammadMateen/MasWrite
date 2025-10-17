"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data.blogs || []));
  }, []);

  // Filtered blogs (based on header search input later)
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);

    const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setBlogs(prev => prev.filter(blog => blog.slug !== slug)); // remove instantly
    }

    setDeletingSlug(null);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>
        <Link
          href="/dashboard/blogs/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + New Post
        </Link>
      </div>

      {/* Filter Info */}
      <div className="mb-4 text-sm text-gray-500">
        Use the top search box to filter blogs by title or content.
      </div>

      {/* Blog list (scrollable) */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id || blog.slug}
              title={blog.title}
              slug={blog.slug}
              authorName={
                typeof blog.author === "string" ? blog.author : blog.author.userName
              }
              excerpt={blog.content.slice(0, 100)} // optional short preview
              publishedAt={blog.publishedAt}
              readingTime={blog.readingTime}
              views={blog.views}
              tags={blog.tags}
              isDashboardBlogs
              onDelete={handleDelete}
              deleting={deletingSlug === blog.slug}
            />
          ))
        ) : (
          <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
            No blog posts yet.
          </div>
        )}
      </div>
    </div>
  );
}
