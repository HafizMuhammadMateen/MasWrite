"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2, FilterIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Blog } from "@/lib/types/blog";
import DeleteConfirmModal from "./DeleteConfirmModal";
import DublicateConfirmModal from "./DublicateConfirmModal";
import FilterModal from "./FilterModal";
import toast from "react-hot-toast";
import Link from "next/link";

interface ManageBlogHeaderProps {
  isBlog: boolean;
  onToggleSelectBulkBlogs: () => void;
  selectedBlogs: Blog[];
}

export default function ManageBlogHeader({ isBlog, onToggleSelectBulkBlogs, selectedBlogs }: ManageBlogHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDublicateModal, setShowDublicateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [dublicatingBulk, setDublicatingBulk] = useState(false);

  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [searchCategory, setSearchCategory] = useState("");

  const hasActiveFilters = !!(status || category || sort);

  const applyFilters = (overrides?: { q?: string; status?: string; category?: string; sort?: string }) => {
    const merged = { q, status, category, sort, ...overrides };
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(merged).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setStatus("");
    setCategory("");
    setSort("");
    const params = new URLSearchParams(searchParams.toString());
    ["status", "category", "sort", "page"].forEach((k) => params.delete(k));
    router.push(`?${params.toString()}`);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeletingBulk(true);
      const res = await fetch("/api/manage-blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBlogs.map((blog) => blog._id)),
      });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
      toast.success("Selected blogs deleted successfully");
    } catch {
      toast.error("Error deleting blogs");
    } finally {
      setDeletingBulk(false);
      setShowDeleteModal(false);
    }
  };

  const handleConfirmDublicate = async () => {
    try {
      setDublicatingBulk(true);
      const blogsToDublicate = selectedBlogs.map((blog: Blog) => ({
        ...blog,
        title: blog.title + " - Copied",
      }));
      const res = await fetch("/api/manage-blogs/dublicate-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogsToDublicate }),
      });
      if (!res.ok) throw new Error("Failed to duplicate blog");
      router.refresh();
      toast.success("Selected blogs duplicated!");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDublicatingBulk(false);
      setShowDublicateModal(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const delay = setTimeout(() => applyFilters(), 300);
    return () => clearTimeout(delay);
  }, [q]);

  return (
    <div className="flex items-center justify-between mb-6 flex-shrink-0 mx-3">
      {/* Left: bulk actions */}
      <div className="flex items-center gap-4">
        {isBlog && (
          <input
            type="checkbox"
            onClick={onToggleSelectBulkBlogs}
            className="w-5 h-5 accent-blue-500 cursor-pointer"
          />
        )}

        {isBlog && selectedBlogs.length > 0 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-lg cursor-pointer">
                  Bulk Action
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="text-md cursor-pointer"
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete selection
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-md cursor-pointer"
                  onClick={() => setShowDublicateModal(true)}
                >
                  Duplicate selection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="border border-primary py-1 px-4 rounded-sm">
              <p className="text-primary">{selectedBlogs.length} selected</p>
            </div>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800">Manage Your Blogs</h1>

      {/* Right: search + filters + new post */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <input
          type="text"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="text-lg border rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <Button
          variant="outline"
          className="text-lg cursor-pointer"
          onClick={() => setShowFilterModal(true)}
        >
          <FilterIcon />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 w-2 h-2 rounded-full bg-primary inline-block" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-destructive cursor-pointer"
            title="Clear filters"
            onClick={clearFilters}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <Link href="/dashboard/manage-blogs/new">
          <Button variant="primary">
            <Edit2 className="w-5 h-5" /> New Post
          </Button>
        </Link>
      </div>

      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onConfirm={() => {
          applyFilters();
          setShowFilterModal(false);
        }}
        sort={sort}
        setSort={setSort}
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <DublicateConfirmModal
        open={showDublicateModal}
        onClose={() => setShowDublicateModal(false)}
        onConfirm={handleConfirmDublicate}
        dublicating={dublicatingBulk}
      />

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        deleting={deletingBulk}
      />
    </div>
  );
}
