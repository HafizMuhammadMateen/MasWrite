"use client";

import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface BlogPaginationProps {
  page: number;
  totalPages: number;
  searchParams: URLSearchParams;
}

export default function BlogPagination({ page, totalPages, searchParams }: BlogPaginationProps) {
  const router = useRouter();

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-4 mt-4">
      {totalPages > 1 && (
        <>
          <button
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 1}
            className={`inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition ${
              page === 1 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <FiChevronLeft className="w-4 h-4" /> Prev
          </button>

          <span className="text-gray-700 font-medium">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => handleChangePage(page + 1)}
            disabled={page === totalPages}
            className={`inline-flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition ${
              page === totalPages ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Next <FiChevronRight className="w-4 h-4" />
          </button>
      </>
      )}
    </div>
  );
}
