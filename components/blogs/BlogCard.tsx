"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Clock, Eye, Calendar, Edit, Trash, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import toast from "react-hot-toast";

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  authorName: string;
  readingTime: number;
  views: number;
  tags: string[];
  isDashboardBlogs?: boolean;
  status?: "published" | "draft";
  onDelete?: (slug: string) => void;
  deleting?: boolean;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
  selected?: boolean;
}

export default function BlogCard({
  id,
  title,
  slug,
  content,
  excerpt,
  authorName,
  readingTime,
  views,
  tags,
  isDashboardBlogs,
  status,
  onDelete,
  deleting = false,
  category,
  createdAt,
  publishedAt,
  selected,
}: BlogCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const handleClickDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete(slug);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const makeDuplicateBlog = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      setDuplicating(true);
      const res = await fetch("/api/manage-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title + " - Copied", content, authorName, tags, category, status, publishedAt }),
      });
      if (!res.ok) throw new Error();
      toast.success("Blog duplicated!");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDuplicating(false);
    }
  };

  const dateLabel = publishedAt ? "Published" : createdAt ? "Created" : null;
  const dateValue = publishedAt
    ? new Date(publishedAt).toLocaleDateString()
    : createdAt
    ? new Date(createdAt).toLocaleDateString()
    : null;

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-xl border transition-all duration-200 hover:shadow-md group",
          selected
            ? "border-primary/40 shadow-sm shadow-primary/5"
            : "border-gray-100 hover:border-gray-200"
        )}
      >
        <Link href={`/dashboard/manage-blogs/${slug}`} target="_blank" className="block p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Left: content */}
            <div className="flex-1 min-w-0">
              {category && (
                <Badge className="mb-1.5 text-xs bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-50">
                  {category}
                </Badge>
              )}
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
              {excerpt && (
                <p className="text-sm text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">{excerpt}</p>
              )}
              {tags && tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      className="text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50 cursor-default"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge className="text-xs bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-50 cursor-default">
                      +{tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Right: status + actions */}
            {isDashboardBlogs && (
              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  className={cn(
                    "text-xs font-medium capitalize cursor-default select-none",
                    status === "published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                      : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50"
                  )}
                >
                  {status}
                </Badge>

                <div className="flex items-center gap-0.5">
                  <button
                    title="Duplicate"
                    onClick={makeDuplicateBlog}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    {duplicating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FaRegCopy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    title="Edit"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/dashboard/manage-blogs/${slug}/edit`);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Delete"
                    disabled={deleting}
                    onClick={handleClickDelete}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {authorName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime ?? 0} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views ?? 0} views
              </span>
            </div>
            {dateValue && (
              <span className="flex items-center gap-1">
                {isDashboardBlogs && dateLabel && <span>{dateLabel}:</span>}
                <Calendar className="w-3 h-3" />
                {dateValue}
              </span>
            )}
          </div>
        </Link>
      </div>

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </>
  );
}
