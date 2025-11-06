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
import { CheckSquare, ChevronDown, Edit2 } from "lucide-react";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import { useRouter, useSearchParams } from "next/navigation";

interface ManageBlogHeaderProps {
  onToggleSelectAllMode?: () => void;
  allBlogsSelected?: boolean;
}

export default function ManageBlogHeader({ onToggleSelectAllMode, allBlogsSelected }: ManageBlogHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [q, setQ] = useState("");

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries({ q, status, category, sort }).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page whenever filters change
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const delay = setTimeout(handleFilterChange, 300); // debounce for search typing
    return () => clearTimeout(delay);
  }, [q, status, category, sort]);

  return (
    <div className="flex items-center justify-between mb-6 flex-shrink-0 mx-3">
      <h1 className="text-3xl font-bold text-gray-800">Manage Your Blogs</h1>

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
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setSort("")}>All</DropdownMenuItem>
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setSort("createdAt")}>
              Created At
            </DropdownMenuItem>
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setSort("publishedAt")}>
              Published At
            </DropdownMenuItem>
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setSort("updatedAt")}>
              Updated At
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg cursor-pointer">
              {status ? `Status: ${status}` : "Status"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setStatus("")}>All</DropdownMenuItem>
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setStatus("published")}>Published</DropdownMenuItem>
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setStatus("draft")}>Draft</DropdownMenuItem>
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
            <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => setCategory("")}>All</DropdownMenuItem>
            {BLOG_CATEGORIES.map((cat) => (
              <DropdownMenuItem className="text-lg cursor-pointer" key={cat} onClick={() => setCategory(cat)}>
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Select all blogs button */}
        <Button
          variant={allBlogsSelected ? "default" : "outline"}
          onClick={onToggleSelectAllMode}
          className="text-lg cursor-pointer flex items-center gap-1"
        >
          <CheckSquare className="w-5 h-5" />
          {allBlogsSelected ? "Deselect All" : "Select All"}
        </Button>

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
