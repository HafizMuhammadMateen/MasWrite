"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, FilterIcon, Loader2 } from "lucide-react";
import { FaRegCopy } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applying?: boolean;

  // Sorting props
  sort: string;
  setSort: (value: string) => void;  
  status: string;
  setStatus: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  searchCategory: string;
  setSearchCategory: (value: string) => void;
}

export default function FilterModal({
  open,
  onClose,
  onConfirm,
  applying = false,
  sort,
  setSort,
  status,
  setStatus,
  category,
  setCategory,
  searchCategory,
  setSearchCategory,
}: FilterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-lg text-center font-semibold text-gray-800">
            Filters
          </DialogTitle>
          {/* <DialogDescription className="text-gray-600">
            You're about to duplicate the selected blog(s). Do you want to continue?
          </DialogDescription> */}
        </DialogHeader>

        {/* Sort Dropdown */}
        <DropdownMenu>
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
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setStatus("")}>All</DropdownMenuItem>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setStatus("published")}>Published</DropdownMenuItem>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => setStatus("draft")}>Draft</DropdownMenuItem>
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
          <DropdownMenuContent className="w-56 text-md border bg-white shadow-lg rounded-md">
            {/* Search input stays fixed at top */}
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
        </DropdownMenu>

        <DialogFooter className="flex justify-center items-center gap-3">
          <Button className="cursor-pointer" variant="outline" onClick={onClose} disabled={applying}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={applying}
            className="text-sm cursor-pointer"
          >
            {applying ? (
              <>
                Applying
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                <FilterIcon className="w-4 h-4" />
                Apply Filter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
