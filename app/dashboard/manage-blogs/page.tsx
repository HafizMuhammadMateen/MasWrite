"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";
import ManageBlogHeader from "@/components/blogs/ManageBlogHeader";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ManageBlogHeaderProps {
  onFilterChange: (filters: {
    q: string;
    status: string;
    category: string;
    sort: string;
  }) => void;
}

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    category: "",
    sort: "",
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  setPage(1);
}, [filters]);


// Fetch blogs whenever filters or page change
useEffect(() => {
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...(filters.q ? { q: filters.q } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.sort ? { sort: filters.sort } : {}),
        page: page.toString(),
      });

      const res = await fetch(`/api/manage-blogs?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  fetchBlogs();
}, [filters, page]); // 👈 include `page` here


  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/manage-blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
    } finally {
      setDeletingId(null);
    }
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

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="cursor-pointer inline-flex items-center px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              <FiChevronLeft className="w-4 h-4" /> Prev
            </button>

            <span className="text-gray-700 font-medium">
              {page} / {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={page === totalPages}
              className="cursor-pointer inline-flex items-center px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts found.
        </div>
      )}
    </div>
  );
}
