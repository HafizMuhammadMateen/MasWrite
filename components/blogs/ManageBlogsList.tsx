"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Blog } from "@/lib/types/blog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "@/components/blogs/BlogCard";
import toast from "react-hot-toast";

interface ManageBlogsListProps {
  blogs: Blog[];
  totalPages: number;
  page: number;
  searchParams: URLSearchParams;
  bulkBlogsSelected: boolean;
  selectedBlogs: Blog[];
  setSelectedBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
}

export default function ManageBlogsList({
  blogs,
  totalPages,
  page,
  searchParams,
  bulkBlogsSelected,
  selectedBlogs,
  setSelectedBlogs,
}: ManageBlogsListProps) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setSelectedBlogs(bulkBlogsSelected ? blogs : []);
  }, [bulkBlogsSelected, blogs]);

  const toggleSelectBlog = (blog: Blog) => {
    setSelectedBlogs((prev) =>
      prev.some((b) => b._id === blog._id)
        ? prev.filter((b) => b._id !== blog._id)
        : [...prev, blog]
    );
  };

  const handleDelete = async (slug: string) => {
    try {
      setDeletingSlug(slug);
      const res = await fetch(`/api/manage-blogs/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Blog deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
      {blogs.map((blog) => (
        <div key={blog._id} className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selectedBlogs.some((b) => b._id === blog._id)}
            onChange={() => toggleSelectBlog(blog)}
            className="mt-4 w-4 h-4 accent-primary cursor-pointer shrink-0"
          />
          <div className="flex-1 min-w-0">
            <BlogCard
              id={blog._id}
              title={blog.title}
              slug={blog.slug}
              content={blog.content}
              excerpt={blog.content.replace(/<[^>]*>/g, " ").slice(0, 120)}
              authorName={
                typeof blog.author === "string" ? blog.author : blog.author?.userName
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
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4 pb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChangePage(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>

          <span className="text-sm text-gray-500 font-medium px-2">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
