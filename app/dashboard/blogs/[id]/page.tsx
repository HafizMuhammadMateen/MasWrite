"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Blog } from "@/lib/types/blog";

export default function SingleBlog() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`).then(res => res.json()).then(setBlog);
  }, [slug]);

  const handleDelete = async () => {
    await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    router.push("/dashboard/blogs");
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl">{blog.title}</h1>
      <p className="mt-2">{blog.content}</p>
      <button onClick={() => router.push(`/dashboard/blogs/${slug}/edit`)} className="text-blue-500 mt-4">Edit</button>
      <button onClick={handleDelete} className="text-red-500 ml-2">Delete</button>
    </div>
  );
}
