"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BlogCardProps } from "@/lib/types/blog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { User, Clock, Eye, Calendar, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function BlogCard({
  title,
  slug,
  authorName,
  excerpt,
  publishedAt,
  readingTime,
  views,
  tags,
}: BlogCardProps) {
  const pathname = usePathname();
  const isDashboardBlogs = pathname === "/dashboard/blogs";

  return (
    <Card
      className="bg-gray-50 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:z-[1] cursor-pointer"
    >
      <Link href={`/dashboard/blogs/${slug}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-gray-800 hover:underline">
            {title}
          </CardTitle>

          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
            <User className="w-4 h-4" />
            <span>{authorName}</span>
          </div>

          {excerpt && (
            <p className="text-base text-gray-600 line-clamp-2 mt-2">
              {excerpt}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-2">
          <Separator className="my-2" />

          <div className="flex items-center justify-between text-sm text-gray-500">
            {/* Left side: reading time + views */}
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

            {/* Right side: date */}
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
          {tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Conditionally show buttons */}
        {isDashboardBlogs && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" /> Update
            </Button>
            <Button variant="destructive" size="sm">
              <Trash className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
