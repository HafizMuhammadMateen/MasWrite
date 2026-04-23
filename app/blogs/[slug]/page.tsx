import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Calendar, User, ArrowLeft } from "lucide-react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  await connectDB();
  const blogs = await Blog.find({ status: "published" }, "slug").lean();
  return (blogs as any[]).map((b) => ({ slug: b.slug as string }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug }).lean() as any;
  if (!blog) return { title: "Blog Not Found | MasWrite" };
  const description = blog.content.replace(/<[^>]*>/g, " ").trim().slice(0, 160);
  return {
    title: `${blog.title} | MasWrite`,
    description,
  };
}

export default async function SingleBlogPage({ params }: PageProps) {
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug })
    .populate("author", "userName name")
    .lean() as any;

  if (!blog) notFound();

  // Fire-and-forget view increment
  fetch(`${process.env.NEXTAUTH_URL}/api/manage-blogs/${slug}/view`, { method: "POST" }).catch(() => {});

  const author = typeof blog.author === "object"
    ? blog.author?.userName || blog.author?.name
    : blog.author;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to blogs
      </Link>

      <article>
        <div className="mb-6">
          {blog.category && (
            <Badge variant="outline" className="mb-3 text-sm">
              {blog.category}
            </Badge>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

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

          <div className="flex items-center gap-4 text-sm text-gray-500">
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
        </div>

        <hr className="my-6 border-gray-200" />

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
}
