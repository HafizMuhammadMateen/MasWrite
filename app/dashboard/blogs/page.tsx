"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";
import ManageBlogHeader from "@/components/blogs/ManageBlogHeader";

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch blogs whenever filters change
  useEffect(() => {
    console.log("Filters changed:", filters) // <— Add this
    const fetchBlogs = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        ...(filters.q ? { q: filters.q } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.category ? { category: filters.category } : {}),
      });
      console.log("Query params:", params.toString()); // <— Add this


      const res = await fetch(`/api/blogs?${params.toString()}`);
      const data = await res.json();
      setBlogs(data.blogs || []);
      setLoading(false);
    };

    fetchBlogs();
  }, [filters]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    }

    setDeletingId(null);
  };

  return (
    <div className="p-6 flex flex-col h-full overflow-hidden">
      <ManageBlogHeader onFilterChange={setFilters} />

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              title={blog.title}
              slug={blog.slug}
              authorName={
                typeof blog.author === "string"
                  ? blog.author
                  : blog.author?.userName
              }
              excerpt={blog.content?.slice(0, 100)}
              publishedAt={blog.publishedAt}
              readingTime={blog.readingTime}
              views={blog.views}
              tags={blog.tags}
              isDashboardBlogs
              onDelete={handleDelete}
              deleting={deletingId === blog._id}
              status={blog.status as "published" | "draft"}
              id={blog._id}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts found.
        </div>
      )}
    </div>
  );
}
