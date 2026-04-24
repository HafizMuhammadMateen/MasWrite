"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FilterIcon, Loader2 } from "lucide-react";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applying?: boolean;
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
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-lg text-center font-semibold text-gray-800">
            Filters
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm cursor-pointer">
                {sort ? `Sort: ${sort}` : "Sort by"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => setSort("newest")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("oldest")}>Oldest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("updated")}>Recently Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("published")}>Recently Published</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm cursor-pointer capitalize">
                {status ? `Status: ${status}` : "Status"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => setStatus("")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatus("published")}>Published</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatus("draft")}>Draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm cursor-pointer">
                {category ? `Category: ${category}` : "Category"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <div className="sticky top-0 bg-white z-10 p-1">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="text-sm border rounded px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                <DropdownMenuItem
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setCategory(""); setSearchCategory(""); }}
                >
                  All
                </DropdownMenuItem>
                {BLOG_CATEGORIES
                  .filter((cat) => cat.toLowerCase().includes(searchCategory.toLowerCase()))
                  .map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setCategory(cat); setSearchCategory(""); }}
                    >
                      {cat}
                    </DropdownMenuItem>
                  ))}
                {BLOG_CATEGORIES.filter((cat) =>
                  cat.toLowerCase().includes(searchCategory.toLowerCase())
                ).length === 0 && searchCategory && (
                  <div className="px-3 py-2 text-gray-500 text-center text-sm">No categories found</div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DialogFooter className="flex justify-center items-center gap-3 mt-2">
          <Button variant="outline" onClick={onClose} disabled={applying} className="cursor-pointer">
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={applying} className="cursor-pointer">
            {applying ? (
              <>Applying <Loader2 className="w-4 h-4 animate-spin ml-1" /></>
            ) : (
              <><FilterIcon className="w-4 h-4 mr-1" /> Apply Filter</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
