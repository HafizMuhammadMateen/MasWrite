"use client";

import { useState } from "react";
import ManageBlogHeader from "./ManageBlogHeader";
import ManageBlogsList from "./ManageBlogsList";
import { Blog } from "@/lib/types/blog";

interface ManageBlogsListWrapperProps {
  blogs: Blog[];
  totalPages: number;
  page: number;
  searchParams: URLSearchParams;
}

export default function ManageBlogsListWrapper({ blogs, totalPages, page, searchParams }: ManageBlogsListWrapperProps) {
  const [bulkBlogsSelected, setBulkBlogsSelected] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState<Blog[]>([]);

  return (
    <>
      <ManageBlogHeader
        isBlog={blogs.length > 0}
        onToggleSelectBulkBlogs={() => setBulkBlogsSelected((prev) => !prev)}
        selectedBlogs={selectedBlogs}           // Blog obj
      />
      
      {blogs.length > 0 ? (
        <ManageBlogsList
          blogs={blogs}
          totalPages={totalPages}
          page={page}
          searchParams={searchParams}
          bulkBlogsSelected={bulkBlogsSelected} // boolean
          selectedBlogs={selectedBlogs}         // Blog obj
          setSelectedBlogs={setSelectedBlogs}
        />
      ) : (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts found.
        </div>
      )}
    </>
  );
}