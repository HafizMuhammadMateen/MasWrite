import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { error } from "console";

export async function POST(_: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params;

  const blog = await Blog.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true, projection: { views: 1 } } // return only views field
  );

  if (!blog) return error("Blog not found", 404);

  return NextResponse.json({ views: blog.views });
}
