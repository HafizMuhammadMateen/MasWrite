import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { slugify } from "@/utils/blogsHelpers";

// Get single blog
export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params;
  const blog = await Blog.findOne({ slug });
  return NextResponse.json(blog);
}

// Update single blog
export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params; // old slug

  const data = await req.json() as { title: string; content: string };

  const newSlug = slugify(data.title);
  const words = data.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  const blog = await Blog.findOneAndUpdate(
    { slug }, // find by old slug
    { ...data, slug: newSlug, readingTime },
    { new: true }
  );

  return NextResponse.json(blog);
}

// Delete single blog
export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params;
  await Blog.findOneAndDelete({ slug });
  return NextResponse.json({ message: "Blog Deleted" });
}
