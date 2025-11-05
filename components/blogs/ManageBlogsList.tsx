"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import BlogPagination from "@/components/blogs/BlogPagination";
import { Blog } from "@/lib/types/blog";

interface ManageBlogsListProps {
  blogs: Blog[];
  totalPages: number;
  page: number;
  params: URLSearchParams;
}

export default function ManageBlogsList({ blogs, totalPages, page, params }: ManageBlogsListProps) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

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
        <BlogCard
          key={blog._id}
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
          onDelete={handleDelete}                   // passed down
          deleting={deletingSlug === blog.slug}     // for loader state
        />
      ))}

      <BlogPagination page={page} totalPages={totalPages} searchParams={params} />
    </div>
  );
}
