"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, PenLine, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Blog } from "@/lib/types/blog";
import DeleteConfirmModal from "./DeleteConfirmModal";
import DublicateConfirmModal from "./DublicateConfirmModal";
import FilterModal from "./FilterModal";
import toast from "react-hot-toast";
import Link from "next/link";

interface ManageBlogHeaderProps {
  isBlog: boolean;
  bulkBlogsSelected: boolean;
  totalCount: number;
  onToggleSelectBulkBlogs: () => void;
  selectedBlogs: Blog[];
}

export default function ManageBlogHeader({
  isBlog,
  bulkBlogsSelected,
  totalCount,
  onToggleSelectBulkBlogs,
  selectedBlogs,
}: ManageBlogHeaderProps) {
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
  const activeFilterCount = [status, category, sort].filter(Boolean).length;
  const someSelected = selectedBlogs.length > 0 && selectedBlogs.length < totalCount;
  const allSelected = bulkBlogsSelected && selectedBlogs.length === totalCount;

  const applyFilters = (overrides?: Record<string, string>) => {
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
    setStatus(""); setCategory(""); setSort("");
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
        body: JSON.stringify(selectedBlogs.map((b) => b._id)),
      });
      if (!res.ok) throw new Error();
      router.refresh();
      toast.success(`${selectedBlogs.length} blog${selectedBlogs.length > 1 ? "s" : ""} deleted`);
    } catch {
      toast.error("Failed to delete selected blogs");
    } finally {
      setDeletingBulk(false);
      setShowDeleteModal(false);
    }
  };

  const handleConfirmDublicate = async () => {
    try {
      setDublicatingBulk(true);
      const res = await fetch("/api/manage-blogs/dublicate-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogsToDublicate: selectedBlogs.map((b) => ({ ...b, title: b.title + " - Copied" })),
        }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
      toast.success(`${selectedBlogs.length} blog${selectedBlogs.length > 1 ? "s" : ""} duplicated`);
    } catch {
      toast.error("Failed to duplicate selected blogs");
    } finally {
      setDublicatingBulk(false);
      setShowDublicateModal(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => applyFilters(), 300);
    return () => clearTimeout(delay);
  }, [q]);

  return (
    <div className="flex flex-col gap-3 flex-shrink-0">
      {/* Row 1 — title + new post */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manage Blogs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create, edit, and organise your posts</p>
        </div>
        <Link href="/dashboard/manage-blogs/new">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 cursor-pointer">
            <PenLine className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Row 2 — controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Select-all checkbox */}
        {isBlog && (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={onToggleSelectBulkBlogs}
            title="Select all"
          />
        )}

        {/* Bulk action dropdown */}
        {selectedBlogs.length > 0 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 cursor-pointer h-8">
                  Bulk Action
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete selection
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setShowDublicateModal(true)}
                >
                  Duplicate selection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-xs font-medium text-primary border border-primary/30 bg-primary/5 px-2.5 py-1 rounded-full">
              {selectedBlogs.length} selected
            </span>
          </>
        )}

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-8 pl-3 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition w-52 bg-white"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 cursor-pointer h-8 relative"
          onClick={() => setShowFilterModal(true)}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-gray-400 hover:text-destructive cursor-pointer px-2"
            title="Clear all filters"
            onClick={clearFilters}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Modals */}
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onConfirm={() => { applyFilters(); setShowFilterModal(false); }}
        sort={sort} setSort={setSort}
        status={status} setStatus={setStatus}
        category={category} setCategory={setCategory}
        searchCategory={searchCategory} setSearchCategory={setSearchCategory}
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
