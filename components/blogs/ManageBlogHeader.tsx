"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2, FilterIcon, FilterXIcon } from "lucide-react";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import { useRouter, useSearchParams } from "next/navigation";
import { Blog } from "@/lib/types/blog";
import DeleteConfirmModal from "./DeleteConfirmModal";
import DublicateConfirmModal from "./DublicateConfirmModal"
import FilterModal from "./FilterModal"
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
  const [applyingFilter, setApplyingFilter] = useState(false);

  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [q, setQ] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

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

  const handleConfirmDelete = async () => {
    try {
      setDeletingBulk(true);
      const res = await fetch("/api/manage-blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBlogs.map(blog => blog._id)),
      });

      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
      toast.success("All selected blogs deleted successfully");
    } catch (err) {
      console.error("Error deleting blogs:", err);
      toast.error("Error deleting blogs");
    } finally {
      setDeletingBulk(false);
      setShowDeleteModal(false); // Only close the modal after delete completes
    }
  };

  const handleClickDublicate = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDublicateModal(true);
  }

  const handleConfirmDublicate = async() => {
    try {
      setDublicatingBulk(true);

      const blogsToDublicate = selectedBlogs.map((blog: Blog) => { 
        return { 
          ...blog, 
          title: blog.title + " - Copied", 
        } 
      });
      console.log("blogsToDublicate: ", blogsToDublicate)
      const res = await fetch("/api/manage-blogs/dublicate-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          blogsToDublicate
        }),
      })

      if (!res.ok) throw new Error("Failed to dublicate blog");
      router.refresh();
      toast.success("Selected blogs dublicated!");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDublicatingBulk(false);
      setShowDublicateModal(false);
    }
  }

  const handleFilterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowFilterModal(true);
  }

  const handleConfirmFilter = async() => {

  }

  // debounce for search typing
  useEffect(() => {
    const delay = setTimeout(handleFilterChange, 300);
    return () => clearTimeout(delay);
  }, [q, status, category, sort]);

  return (
    <div className="flex items-center justify-between mb-6 flex-shrink-0 mx-3">
      <div className="flex items-center justify-between gap-4">
        {/* Bulk Select Checkbox */}
        {isBlog && <input
          type="checkbox"
          onClick={onToggleSelectBulkBlogs}
          className="w-5 h-5 accent-blue-500 cursor-pointer"
        />}
        {/* Bulk Action Dropdown */}
        {isBlog && selectedBlogs.length > 0 && 
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-lg cursor-pointer">
                  {status ? `Action: ${status}` : "Bulk Action"}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="text-md cursor-pointer" variant="destructive" onClick={handleClickDelete}>Delete selection</DropdownMenuItem>
                <DropdownMenuItem className="text-md cursor-pointer" variant="default" onClick={handleClickDublicate}>Dublicate selection</DropdownMenuItem> 
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="sticky bottom-0 border border-primary py-1 px-4 rounded-sm flex justify-between items-center">
              <p className="text-primary">{selectedBlogs.length} selected</p>
            </div>
          </>
        }
      </div>

      <h1 className="text-3xl font-bold text-gray-800">Manage Your Blogs</h1>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="text-lg border rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Filters */}
        <Button
          variant="outline"
          className="text-lg cursor-pointer"
          onClick={handleFilterClick}
        >
          <FilterIcon />
          Filters
        </Button>
        {/* Dublicate confirmation modal */}
        <FilterModal
          open={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onConfirm={handleConfirmFilter}
          applying={applyingFilter}
          sort="sort"
          setSort={setSort}
          status="status"
          setStatus={setStatus}
          category="category"
          setCategory={setCategory}
          searchCategory="searchCategory"
          setSearchCategory={setSearchCategory}
        />

        {/* Sort Dropdown */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg cursor-pointer">
              {sort ? `Sort by: ${sort}` : "Sort by"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setSort("newest")}>Newest First</DropdownMenuItem>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setSort("oldest")}>Oldest First</DropdownMenuItem>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setSort("updated")}>Recently Updated</DropdownMenuItem>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setSort("published")}>Recently Published</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Status Dropdown */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg cursor-pointer">
              {status ? `Status: ${status}` : "Status"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setStatus("")}>All</DropdownMenuItem>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setStatus("published")}>Published</DropdownMenuItem>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setStatus("draft")}>Draft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Category Dropdown */}
        {false && <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-lg cursor-pointer">
              {category ? `Category: ${category}` : "Category"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 text-md border bg-white shadow-lg rounded-md">
            {/* Search Categories */}
            <div className="sticky top-0 bg-white z-10 p-1">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="text-md border rounded px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Scrollable list */}
            <div className="max-h-64 overflow-y-auto">
              {["All", ...BLOG_CATEGORIES]
                .filter((cat) =>
                  cat === "All" ? true : cat.toLowerCase().includes(searchCategory.toLowerCase())
                )
                .map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    className="text-md cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()} // prevent input losing focus
                    onClick={() => {
                      setCategory(cat === "All" ? "" : cat);
                      setSearchCategory("");
                    }}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}

              {/* No categories found, show message */}
              {BLOG_CATEGORIES.filter((cat) =>
                cat.toLowerCase().includes(searchCategory.toLowerCase())
              ).length === 0 && searchCategory && (
                <div className="px-3 py-1 text-gray-500 text-center">No categories found</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>}

        {/* New Post Button */}
        <Link href="/dashboard/manage-blogs/new">
          <Button variant="primary">
            <Edit2 className="w-5 h-5" /> New Post
          </Button>
        </Link>
      </div>

      {/* Dublicate confirmation modal */}
      <DublicateConfirmModal
        open={showDublicateModal}
        onClose={() => setShowDublicateModal(false)}
        onConfirm={handleConfirmDublicate}
        dublicating={dublicatingBulk}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        deleting={deletingBulk}
      />
    </div>
  );
}
