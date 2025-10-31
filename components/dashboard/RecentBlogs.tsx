import Link from "next/link";
import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface RecentBlogsProps {
  blogs: Blog[];
  page: number;
  totalPages: number;
}

export default function RecentBlogs({ blogs, page, totalPages }: RecentBlogsProps) {
  return (
    <section className="h-full md:col-span-2 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-2xl text-center font-semibold mb-4">Recent Blogs</h2>
      {blogs.length === 0 ? (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts yet.
        </div>
      ) : (
        <>
          {/* Blog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id || blog.slug}
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
                id={blog._id}
              />
            ))}
          </div>

          {/* Server-side Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {page > 1 ? (
                <Link
                  href={`/dashboard/${page - 1}`}
                  className="inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  <FiChevronLeft className="w-4 h-4" /> Prev
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center px-3 py-1 bg-gray-200 rounded opacity-50 cursor-not-allowed"
                >
                  <FiChevronLeft className="w-4 h-4" /> Prev
                </button>
              )}

              <span className="text-gray-700 font-medium">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/dashboard/${page + 1}`}
                  className="inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Next <FiChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center px-3 py-1 bg-gray-200 rounded opacity-50 cursor-not-allowed"
                >
                  Next <FiChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
