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
  const [allBlogsSelected, setAllBlogsSelected] = useState(false);

  return (
    <>
      <ManageBlogHeader
        onToggleSelectAllBlogs={() => setAllBlogsSelected((prev) => !prev)}
        allBlogsSelected={allBlogsSelected}

      />
      
      {blogs.length > 0 ? (
        <ManageBlogsList
          blogs={blogs}
          totalPages={totalPages}
          page={page}
          searchParams={searchParams}
          allBlogsSelected={allBlogsSelected}
        />
      ) : (
        <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">
          No blog posts found.
        </div>
      )}
    </>
  );
}