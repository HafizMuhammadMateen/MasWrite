import { Metadata } from "next";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Calendar, User } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogs | MasWrite",
  description: "Browse all published blog posts on MasWrite",
};

export default async function BlogsPage() {
  await connectDB();
  const blogs = await Blog.find({ status: "published" })
    .populate("author", "userName name")
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Page header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {blogs.length} published post{blogs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-500 text-lg font-medium">No posts published yet.</p>
          <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {(blogs as any[]).map((blog) => {
            const author =
              typeof blog.author === "object"
                ? blog.author?.userName || blog.author?.name
                : blog.author;
            const excerpt = blog.content.replace(/<[^>]*>/g, " ").trim().slice(0, 180);

            return (
              <Link
                key={blog._id.toString()}
                href={`/blogs/${blog.slug}`}
                className="group flex flex-col gap-2 py-6 hover:bg-white hover:shadow-sm hover:rounded-xl hover:px-4 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors leading-snug">
                      {blog.title}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm line-clamp-2 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                  {blog.category && (
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0 mt-0.5 text-gray-500 border-gray-300"
                    >
                      {blog.category}
                    </Badge>
                  )}
                </div>

                {blog.tags?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {blog.tags.slice(0, 4).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs text-blue-600 border-blue-200 bg-blue-50"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 4 && (
                      <span className="text-xs text-gray-400 self-center">
                        +{blog.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {author || "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readingTime ?? 1} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blog.views ?? 0}
                  </span>
                  {blog.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
