import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Calendar, User, ArrowLeft, Edit } from "lucide-react";
import DeleteBlogButton from "@/components/blogs/DeleteBlogButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardBlogViewPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs/${slug}`, {
    headers: { Cookie: (await cookies()).toString() },
  });

  if (!res.ok) notFound();
  const blog = await res.json();

  const author = typeof blog.author === "object"
    ? blog.author?.userName || blog.author?.name
    : blog.author;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/manage-blogs">
          <Button variant="ghost" className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>

        <div className="flex gap-2">
          <Link href={`/dashboard/manage-blogs/${slug}/edit`}>
            <Button variant="outline" className="flex items-center gap-1 cursor-pointer">
              <Edit className="w-4 h-4" /> Edit
            </Button>
          </Link>
          <DeleteBlogButton slug={slug} />
        </div>
      </div>

      <article>
        {/* Status + Category badges */}
        <div className="flex gap-2 mb-3">
          <Badge
            className={
              blog.status === "published"
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-blue-100 text-blue-700 border-blue-300"
            }
            variant="outline"
          >
            {blog.status}
          </Badge>
          {blog.category && (
            <Badge variant="outline" className="text-gray-600">
              {blog.category}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{blog.title}</h1>

        {blog.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {blog.tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs text-blue-700 border-blue-300 bg-blue-50"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {author || "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {blog.readingTime ?? 1} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.views ?? 0} views
          </span>
          {blog.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(blog.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <hr className="my-4 border-gray-200" />

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
}
