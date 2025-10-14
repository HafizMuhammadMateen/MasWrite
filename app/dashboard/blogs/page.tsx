"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Post } from "@/lib/types/post";


export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts").then(res => res.json()).then(setPosts);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <Link href="/dashboard/blogs/new" className="text-blue-500">+ New Post</Link>
      <ul className="mt-4 space-y-2">
        {posts.map(p => (
          <li key={p.slug || p._id}>
            <Link href={`blogs/${p.slug}`} className="font-semibold">{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
