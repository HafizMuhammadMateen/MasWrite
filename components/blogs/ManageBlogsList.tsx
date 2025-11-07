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
  bulkBlogsSelected: boolean;
  selectedBlogs: string[];
  setSelectedBlogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ManageBlogsList({ blogs, totalPages, page, searchParams, bulkBlogsSelected, selectedBlogs, setSelectedBlogs }: ManageBlogsListProps) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // Update selected blogs when bulkBlogsSelected changes
  useEffect(() => {
    if (bulkBlogsSelected) {
      const allBlogSlugs = blogs.map((blog) => blog._id);
      setSelectedBlogs(allBlogSlugs);
    } else {
      setSelectedBlogs([]);
    }
  }, [bulkBlogsSelected, blogs]);

  // Toggle selection of individual blog
  const toggleSelectBlog = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
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
              id={blog._id}
              title={blog.title}
              slug={blog.slug}
              content={blog.content}     // for dublicating purpose
              excerpt={blog.content.slice(0, 100)}
              authorName={typeof blog.author === "string" 
                ? blog.author 
                : blog.author?.userName
              }
              readingTime={blog.readingTime}
              views={blog.views}
              tags={blog.tags}
              isDashboardBlogs
              status={blog.status as "published" | "draft"}
              onDelete={handleDelete}
              deleting={deletingSlug === blog.slug}
              category={blog.category}
              createdAt={blog.createdAt}
              publishedAt={blog.publishedAt}
            />
          </div>
        </div>
      ))}

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
