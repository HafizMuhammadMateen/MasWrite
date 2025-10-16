"use client";

import Link from "next/link";
import { BlogCardProps } from "@/lib/types/blog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { User, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <Link
          href={`/blogs/${slug}`}
          className="text-2xl font-semibold text-blue-600 hover:underline"
        >
          {title}
        </Link>
        {excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{excerpt}</p>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        <Separator className="my-2" />

        <div className="flex flex-wrap items-center justify-between text-md text-gray-500 gap-2">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{authorName}</span>
          </div>

          {publishedAt && (
            <span className="text-gray-400">
              {new Date(publishedAt).toLocaleDateString()}
            </span>
          )}

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime ?? 0} min read</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views ?? 0} views</span>
          </div>
        </div>
      </CardContent>

      {tags && tags.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2 pt-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
