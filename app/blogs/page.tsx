"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Blog } from "@/lib/types/blog";


export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/manage-blogs")
      .then(res => res.json())
      .then((data) => setBlogs(data.blogs || []));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      {/* <Link href="/blog/new" className="text-blue-500">+ New Blog</Link> */}
      <ul className="mt-4 space-y-2">
        {blogs.map(blog => (
          <li key={blog._id}>
            <Link href={`blogs/${blog._id}`} className="font-semibold">{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
