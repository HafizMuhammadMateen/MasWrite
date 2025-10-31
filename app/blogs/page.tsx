"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Blog } from "@/lib/types/blog";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/manage-blogs", { method: "GET" })
      .then(res => res.json())
      .then((data) => setBlogs(data.blogs || []));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Published Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No published blogs yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {blogs.map(blog => (
            <li key={blog._id}>
              <Link href={`blogs/${blog.slug}`} className="font-semibold hover:underline">
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
