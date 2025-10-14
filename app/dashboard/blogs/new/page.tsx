"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    router.push("/dashboard/blogs");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full mb-2" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="border p-2 w-full mb-2" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Create</button>
    </form>
  );
}
