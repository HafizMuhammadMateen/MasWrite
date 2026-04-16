"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import BlogEditor from "@/components/blogs/BlogEditor"
import type { Blog } from "@/lib/types/blog"

export default function EditBlogPage() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/manage-blogs/${slug}`)
      .then((r) => r.json())
      .then(setBlog)
      .catch((err) => console.error("Failed to fetch blog", err))
  }, [slug])

  if (!blog) return null

  return <BlogEditor initialData={blog} slug={slug} />
}
