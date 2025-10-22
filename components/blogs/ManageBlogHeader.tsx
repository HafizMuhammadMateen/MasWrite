"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function ManageBlogHeader({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {
  const [status, setStatus] = useState("")
  const [category, setCategory] = useState("")
  const [q, setQ] = useState("")

  const handleChange = (newFilters: Partial<{ q: string; status: string; category: string }>) => {
    const updated = { q, status, category, ...newFilters }
    onFilterChange?.(updated)
  }

  // Debounce title input
  useEffect(() => {
    const delay = setTimeout(() => {
      handleChange({ q })
    }, 400) // waits 400ms after user stops typing
    return () => clearTimeout(delay)
  }, [q])

  return (
    <div className="flex items-center justify-between mb-6 flex-shrink-0">
      <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Title Filter */}
        <input
          type="text"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              {status ? `Status: ${status}` : "Filter by Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { setStatus(""); handleChange({ status: "" }) }}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setStatus("published"); handleChange({ status: "published" }) }}>Published</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setStatus("draft"); handleChange({ status: "draft" }) }}>Draft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              {category ? `Category: ${category}` : "Filter by Category"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-y-auto">
            <DropdownMenuItem onClick={() => { setCategory(""); handleChange({ category: "" }) }}>All</DropdownMenuItem>
            {["Web Development","UI/UX","JavaScript","React","Next.js","Backend","Databases","DevOps","AI/ML","Other"]
              .map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => { setCategory(cat); handleChange({ category: cat }) }}>
                  {cat}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Post Button */}
        <Link
          href="/dashboard/blogs/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + New Post
        </Link>
      </div>
    </div>
  )
}
