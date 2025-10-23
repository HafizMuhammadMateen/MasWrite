"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BlogCardProps } from "@/lib/types/blog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { User, Clock, Eye, Calendar, Edit, Trash, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ExtendedBlogCardProps extends BlogCardProps {
  isDashboardBlogs?: boolean;
  onDelete?: (slug: string) => void;
  deleting?: boolean;
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
}: ExtendedBlogCardProps) {
  const router = useRouter();

  return (
    <Card className="bg-gray-100 pb-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:z-[1]">
      <Link href={`/dashboard/blogs/${slug}`}>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800 hover:underline">
                {title}
              </CardTitle>

              <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                <User className="w-4 h-4" />
                <span>{authorName}</span>
              </div>

              {excerpt && <p className="text-base text-gray-600 line-clamp-2 mt-2">{excerpt}</p>}
            </div>

            {isDashboardBlogs && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    router.push(`/dashboard/blogs/${slug}/edit`);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" /> Update
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer hover:bg-red-700"
                  disabled={deleting}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    onDelete?.(slug);
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
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Separator className="mb-2" />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(publishedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-wrap items-center justify-between pt-3">
        <div className="flex flex-wrap gap-2">
          {tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
