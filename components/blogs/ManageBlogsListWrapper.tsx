"use client";

import { useState } from "react";
import ManageBlogHeader from "./ManageBlogHeader";
import ManageBlogsList from "./ManageBlogsList";
import { Blog } from "@/lib/types/blog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

interface ManageBlogsListWrapperProps {
  blogs: Blog[];
  totalPages: number;
  page: number;
  searchParams: URLSearchParams;
}

export default function ManageBlogsListWrapper({
  blogs,
  totalPages,
  page,
  searchParams,
}: ManageBlogsListWrapperProps) {
  const [bulkBlogsSelected, setBulkBlogsSelected] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState<Blog[]>([]);

  return (
    <div className="flex flex-col h-full gap-4">
      <ManageBlogHeader
        isBlog={blogs.length > 0}
        bulkBlogsSelected={bulkBlogsSelected}
        totalCount={blogs.length}
        onToggleSelectBulkBlogs={() => setBulkBlogsSelected((prev) => !prev)}
        selectedBlogs={selectedBlogs}
      />

      {blogs.length > 0 ? (
        <ManageBlogsList
          blogs={blogs}
          totalPages={totalPages}
          page={page}
          searchParams={searchParams}
          bulkBlogsSelected={bulkBlogsSelected}
          selectedBlogs={selectedBlogs}
          setSelectedBlogs={setSelectedBlogs}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center">
          <p className="text-4xl mb-4">📄</p>
          <p className="text-gray-700 font-semibold text-lg">No posts found</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            Try adjusting your search or filters, or create a new post
          </p>
          <Link href="/dashboard/manage-blogs/new">
            <Button variant="primary" className="flex items-center gap-2 cursor-pointer">
              <PenLine className="w-4 h-4" />
              Write your first post
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
