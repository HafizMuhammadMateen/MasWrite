"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2 } from "lucide-react";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";

export default function ManageBlogHeader({
  onFilterChange,
}: {
  onFilterChange: (filters: {
    q: string;
    status: string;
    category: string;
    sort: string;
  }) => void;
}) {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [q, setQ] = useState("");

  // ✅ Whenever any filter changes, notify parent after small delay
  useEffect(() => {
    const delay = setTimeout(() => {
      onFilterChange({
        q,
        status,
        category,
        sort,
      });
    }, 400); // debounce for search typing
    return () => clearTimeout(delay);
  }, [q, status, category, sort]);

  return (
    <div className="flex items-center justify-between mb-6 flex-shrink-0 mx-3">
      <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="text-lg border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg cursor-pointer">
              {sort ? `Sort by: ${sort}` : "Sort by"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setSort("")}>All</DropdownMenuItem>
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setSort("createdAt")}>
              Created At
            </DropdownMenuItem>
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setSort("publishedAt")}>
              Published At
            </DropdownMenuItem>
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setSort("updatedAt")}>
              Updated At
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg captialize cursor-pointer">
              {status ? `Status: ${status}` : "Status"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setStatus("")}>All</DropdownMenuItem>
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setStatus("published")}>Published</DropdownMenuItem>
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setStatus("draft")}>Draft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg cursor-pointer">
              {category ? `Category: ${category}` : "Category"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-y-auto text-md">
            <DropdownMenuItem className="text-lg captialize cursor-pointer" onClick={() => setCategory("")}>All</DropdownMenuItem>
            {BLOG_CATEGORIES.map((cat) => (
              <DropdownMenuItem className="text-lg captialize cursor-pointer" key={cat} onClick={() => setCategory(cat)}>
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Post Button */}
        <Link href="/dashboard/manage-blogs/new">
          <Button variant="newPostButton" className="text-md">
            <Edit2 className="w-5 h-5" /> New Post
          </Button>
        </Link>
      </div>
    </div>
  );
}
