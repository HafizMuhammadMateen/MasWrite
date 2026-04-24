import BlogCard from "@/components/blogs/BlogCard";
import { Blog } from "@/lib/types/blog";
import Link from "next/link";

interface RecentBlogsProps {
  blogs: Blog[];
}

export default function RecentBlogs({ blogs }: RecentBlogsProps) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Recent Posts</h2>
        <Link
          href="/dashboard/manage-blogs"
          className="text-sm text-primary hover:underline font-medium"
        >
          View all
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <p className="text-3xl mb-3">✍️</p>
          <p className="text-gray-500 font-medium">No posts yet</p>
          <p className="text-gray-400 text-sm mt-1">Start writing your first blog post</p>
          <Link
            href="/dashboard/manage-blogs/new"
            className="mt-4 text-sm text-primary hover:underline font-medium"
          >
            Write a post →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id || blog.slug}
              id={blog._id}
              title={blog.title}
              slug={blog.slug}
              excerpt={blog.content.replace(/<[^>]*>/g, " ").slice(0, 100)}
              authorName={
                typeof blog.author === "string"
                  ? blog.author
                  : blog.author?.userName || "Unknown"
              }
              readingTime={blog.readingTime}
              views={blog.views}
              tags={blog.tags}
              createdAt={blog.createdAt}
              publishedAt={blog.publishedAt}
            />
          ))}
        </div>
      )}
    </section>
  );
}
