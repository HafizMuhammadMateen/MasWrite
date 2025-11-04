"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ManageBlogHeader from "./ManageBlogHeader";

export default function ManageBlogHeaderWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (filters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.set(key, String(value)); // ensure value is a string
      } else {
        params.delete(key);
      }
    });

    // Reset page whenever filters change
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return <ManageBlogHeader onFilterChange={handleFilterChange} />;
}
