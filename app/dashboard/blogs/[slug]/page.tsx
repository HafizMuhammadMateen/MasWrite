"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/lib/types/post";

export default function SinglePost() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(res => res.json()).then(setPost);
  }, [slug]);

  const handleDelete = async () => {
    await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    router.push("/dashboard/blogs");
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl">{post.title}</h1>
      <p className="mt-2">{post.content}</p>
      <button onClick={() => router.push(`/dashboard/blogs/${slug}/edit`)} className="text-blue-500 mt-4">Edit</button>
      <button onClick={handleDelete} className="text-red-500 ml-2">Delete</button>
    </div>
  );
}
