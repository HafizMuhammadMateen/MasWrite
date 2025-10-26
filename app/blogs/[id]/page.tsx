"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "@/lib/types/blog";

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  // Views counter
  useEffect(() => {
    fetch(`/api/blogs/${id}/view`, { method: "POST" });
  }, [id]);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(setBlog);
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl">{blog.title}</h1>
      <p className="mt-2">{blog.content}</p>
    </div>
  );
}
