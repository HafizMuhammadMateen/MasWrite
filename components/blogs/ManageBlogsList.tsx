"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Blog } from "@/lib/types/blog";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BlogCard from "@/components/blogs/BlogCard";

interface ManageBlogsListProps {
  blogs: Blog[];
  totalPages: number;
  page: number;
  searchParams: URLSearchParams;
  allBlogsSelected?: boolean;
}

export default function ManageBlogsList({ blogs, totalPages, page, searchParams, allBlogsSelected }: ManageBlogsListProps) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (allBlogsSelected) {
      const allBlogSlugs = blogs.map((blog) => blog._id);
      setSelectedBlogs(allBlogSlugs);
    } else {
      setSelectedBlogs([]);
    }
  }, [allBlogsSelected, blogs]);

  // Toggle selection of individual blog
  const toggleSelectBlog = (slug: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );
  };

  const handleDelete = async (slug: string) => {
    try {
      setDeletingSlug(slug);
      const res = await fetch(`/api/manage-blogs/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh(); // reload the page data
    } catch (err) {
      console.error("Error deleting blog:", err);
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-2">
      {blogs.map((blog) => (
        <div key={blog._id} className="flex items-center gap-3 w-full">
          <div className="flex">
            <input
              type="checkbox"
              checked={selectedBlogs.includes(blog._id)}
              onChange={() => toggleSelectBlog(blog._id)}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex-1">
            <BlogCard
              title={blog.title}
              slug={blog.slug}
              authorName={typeof blog.author === "string" ? blog.author : blog.author?.userName}
              excerpt={blog.content?.slice(0, 100)}
              publishedAt={blog.publishedAt}
              readingTime={blog.readingTime}
              views={blog.views}
              tags={blog.tags}
              isDashboardBlogs
              status={blog.status as "published" | "draft"}
              id={blog._id}
              onDelete={handleDelete}
              deleting={deletingSlug === blog.slug}
            />
          </div>
        </div>
      ))}

      {/* Selection Mode Bulk Actions */}
      {(selectedBlogs.length > 0) && (
        <div className="sticky bottom-0 bg-gray-100 border border-red-500 py-3 px-4 rounded-md flex justify-between items-center shadow">
          <p className="text-red-500">{selectedBlogs.length} selected</p>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600 transition"
            onClick={() => console.log("Perform bulk action", selectedBlogs)}
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-4">
        {totalPages > 1 && (
          <>
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 1}
              className={`inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition ${
                page <= 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"
              }`}
            >
              <FiChevronLeft className="w-4 h-4" /> Prev
            </button>
  
            <span className="text-gray-700 font-medium">
              {page} / {totalPages}
            </span>
  
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page === totalPages}
              className={`inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition ${
                page >= totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"
              }`}
            >
              Next <FiChevronRight className="w-4 h-4" />
            </button>
        </>
        )}
      </div>
    </div>
  );
}
