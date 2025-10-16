"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "@/lib/types/blog";

export default function SingleBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  // Views counter
  useEffect(() => {
    fetch(`/api/blogs/${slug}/view`, { method: "POST" });
  }, [slug]);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`).then(res => res.json()).then(setBlog);
  }, [slug]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl">{blog.title}</h1>
      <p className="mt-2">{blog.content}</p>
    </div>
  );
}
