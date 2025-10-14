"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPost() {
  const { slug } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(res => res.json()).then(data => {
      setTitle(data.title);
      setContent(data.content);
    });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`/api/posts/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    router.push(`/dashboard/blogs/${slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full mb-2" />
      <textarea value={content} onChange={e => setContent(e.target.value)} className="border p-2 w-full mb-2" />
      <button className="bg-green-500 text-white px-4 py-2">Update</button>
    </form>
  );
}
