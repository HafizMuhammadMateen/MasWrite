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
import { ChevronDown, Edit2, Loader2, Trash } from "lucide-react";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import { useRouter, useSearchParams } from "next/navigation";
import { Blog } from "@/lib/types/blog";
import DeleteConfirmModal from "./DeleteConfirmModal";
import toast from "react-hot-toast";

interface ManageBlogHeaderProps {
  blogs: Blog[];
  onToggleSelectAllBlogs?: () => void;
  bulkBlogsSelected?: boolean;
  selectedBlogsCount: number;
}

export default function ManageBlogHeader({ blogs, onToggleSelectAllBlogs, bulkBlogsSelected, selectedBlogsCount }: ManageBlogHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deletingAllblogs, setDeletingAllblogs] = useState<string[] | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleClickDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDeleteModal(true);
  }

  const handleConfirmDelete = async (slugs: string[]) => {
    try {
      await handleDeleteAllBlogs(slugs); // Trigger deletion (and wait for it to finish)
    } finally {
      setShowDeleteModal(false); // Only close the modal after delete completes
    }
  };

  const handleDeleteAllBlogs = async (slugs: string[]) => {
    try {
      setDeletingAllblogs(slugs);

      const res = await fetch("/api/manage-blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs }),
      });

      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
      toast.success("All selected blogs deleted successfully");
    } catch (err) {
      console.error("Error deleting blogs:", err);
      toast.error("Error deleting blogs");
    } finally {
      setDeletingAllblogs(null);
    }
  };

  // debounce for search typing
  useEffect(() => {
    const delay = setTimeout(handleFilterChange, 300);
    return () => clearTimeout(delay);
  }, [q, status, category, sort]);

  return (
    <div className="flex items-center justify-between mb-6 flex-shrink-0 mx-3">
      {/* Select all blogs button */}
      {(blogs.length > 0) && 
        <div className="flex items-center justify-between gap-4">
          <input
            type="checkbox"
            onClick={onToggleSelectAllBlogs}
            className="w-5 h-5 accent-blue-500 cursor-pointer"
          />
          {/* Bulk Delete button */}
          {bulkBlogsSelected && <Button
            variant="destructive"
            className="flex items-center cursor-pointer hover:bg-red-700 text-md"
            onClick={handleClickDelete}
            >
            {deletingAllblogs ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="w-6 h-6 mr-1" />
                  Delete selection
                </>
            )}
            </Button>
          }
          {(selectedBlogsCount > 0) && (
            <div className="sticky bottom-0 bg-gray-100 border border-red-500 py-2 px-4 rounded-md flex justify-between items-center shadow">
              <p className="text-red-500">{selectedBlogsCount} selected</p>
            </div>
          )}
        </div>
      }

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

        {/* New Post Button */}
        <Link href="/dashboard/manage-blogs/new">
          <Button variant="newPostButton" className="text-md">
            <Edit2 className="w-5 h-5" /> New Post
          </Button>
        </Link>
      </div>
      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete.bind(null, blogs?.map((blog) => blog.slug))}
        deleting={!!deletingAllblogs}
      />
    </div>
  );
}
