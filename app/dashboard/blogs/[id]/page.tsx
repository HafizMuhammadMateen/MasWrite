"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Blog } from "@/lib/types/blog";

export default function SingleBlog() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    // Fetch blog data
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(setBlog);

    // Increment views
    fetch(`/api/blogs/${id}/view`, { method: "POST" });
  }, [id]);

  const handleDelete = async () => {
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    router.push("/dashboard/blogs");
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl">{blog.title}</h1>
      <p className="mt-2">{blog.content}</p>
      <button onClick={() => router.push(`/dashboard/blogs/${id}/edit`)} className="text-blue-500 mt-4">Edit</button>
      <button onClick={handleDelete} className="text-red-500 ml-2">Delete</button>
    </div>
  );
}
