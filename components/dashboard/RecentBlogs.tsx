"use client";

import { useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";

interface RecentBlogsProps {
  blogs: Blog[];
}

export default function RecentBlogs({ blogs }: RecentBlogsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6; // show 6 blogs per page (2 rows × 3 per row)

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <section className="md:col-span-2">
      {blogs.length === 0 ? (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts yet.
        </div>
      ) : (
        <>
          {/* Blog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                title={blog.title}
                excerpt={blog.content}
                slug={blog.slug}
                authorName={
                  typeof blog.author === "string"
                    ? blog.author
                    : blog.author?.userName || "Unknown"
                }
                publishedAt={blog.publishedAt}
                readingTime={blog.readingTime}
                views={blog.views}
                tags={blog.tags}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Prev
              </button>

              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
