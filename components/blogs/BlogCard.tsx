"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogCardProps } from "@/lib/types/blog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { User, Clock, Eye, Calendar, Edit, Trash, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExtendedBlogCardProps extends BlogCardProps {
  isDashboardBlogs?: boolean;
  onDelete?: (id: string) => void;
  deleting?: boolean;
  status?: "published" | "draft"; // optional status prop
  id: string
}

export default function BlogCard({
  title,
  slug,
  authorName,
  excerpt,
  publishedAt,
  readingTime,
  views,
  tags,
  isDashboardBlogs,
  onDelete,
  deleting = false,
  status,
  id
}: ExtendedBlogCardProps) {
  const router = useRouter();

  return (
    <Card className="bg-gray-100 pb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:z-[1]">
      <Link 
        href={`/dashboard/manage-blogs/${slug}`}
        target="_blank"
      >
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800 hover:underline">
                {title}
              </CardTitle>

              {excerpt && <p className="text-lg text-gray-600 line-clamp-2 mt-1">{excerpt}</p>}
              
              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex mt-2 gap-2">
                  {tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-sm text-blue-700 border border-blue-300 bg-blue-100 cursor-default"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-sm text-gray-600 border border-gray-300 bg-gray-100 cursor-default"
                    >
                      +{tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

            </div>
            {isDashboardBlogs && (
              <div className="flex items-center gap-4">
                <div className="">
                  <Button
                    variant="blogStatus"
                    size="sm"
                    className={cn(
                      "cursor-default disabled:pointer-events-auto disabled:opacity-100 capitalize",
                      status === "published"
                        ? "bg-green-500 hover:bg-green-600"
                        : "text-blue-700 border border-blue-300 bg-blue-100 hover:bg-blue-200 opacity-100"
                    )}
                    disabled
                  >
                    {status}
                  </Button>
                </div>
                <Separator orientation="vertical"/> 
                <div className="flex items-center gap-2">  
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/dashboard/manage-blogs/${id}/edit`);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Update
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer hover:bg-red-700"
                    disabled={deleting}
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete?.(id);
                    }}
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4 mr-1" />
                    )}
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Separator className="my-1" />
          <div className="flex items-center justify-between text-md text-gray-500  mt-2">
            <div className="flex items-center gap-4 cursor-default">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime ?? 0} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{views ?? 0} views</span>
              </div>
            </div>
            {publishedAt && (
              <div className="flex items-center gap-1 text-gray-400 cursor-default">
                <Calendar className="w-4 h-4" />
                <span>{new Date(publishedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
