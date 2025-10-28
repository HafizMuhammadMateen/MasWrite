"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "@/lib/types/blog";

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    // Fetch blog data
    fetch(`/api/manage-blogs/${id}`)
      .then(res => res.json())
      .then(setBlog);

    // Increment views
    fetch(`/api/manage-blogs/${id}/view`, { method: "POST" });
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl">{blog.title}</h1>
      <p className="mt-2">{blog.content}</p>
    </div>
  );
}
