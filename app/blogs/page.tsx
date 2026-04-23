import { Metadata } from "next";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Calendar, User } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Published Blogs | MasWrite",
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Published Blogs</h1>
        <p className="text-gray-500 mt-1">{blogs.length} post{blogs.length !== 1 ? "s" : ""} published</p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No published blogs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(blogs as any[]).map((blog) => {
            const author = typeof blog.author === "object"
              ? blog.author?.userName || blog.author?.name
              : blog.author;
            const excerpt = blog.content.replace(/<[^>]*>/g, " ").trim().slice(0, 160);

            return (
              <Link
                key={blog._id.toString()}
                href={`/blogs/${blog.slug}`}
                className="block bg-white rounded-xl border shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-primary truncate">
                      {blog.title}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm line-clamp-2">{excerpt}</p>

                    {blog.tags?.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {blog.tags.slice(0, 3).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs text-blue-700 border-blue-300 bg-blue-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{blog.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {blog.category && (
                    <Badge variant="outline" className="text-xs shrink-0 mt-1">
                      {blog.category}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
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
                    {blog.views ?? 0} views
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
