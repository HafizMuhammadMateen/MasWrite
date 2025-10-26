import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { slugify } from "@/utils/blogsHelpers";

// GET single blog (READ)
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  const blog = await Blog.findById(id); // if default _id
  // OR: const blog = await Blog.findOne({ id }); // if custom string id

  return NextResponse.json(blog);
}

// PUT single blog (UPDATE)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  const { title, content, tags, category, status } = await req.json();

  if (!title || !content || !tags?.length || !category) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }
  
  const titleWords = title.trim().split(/\s+/).length;
  
  if (titleWords > 10) return NextResponse.json({ message: "Title should be less than 10 words" }, { status: 400 });

  const slug = slugify(title);
  const contentWords = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(contentWords / 200));

  const blog = await Blog.findByIdAndUpdate(
    id,
    { 
      title,
      content,
      slug,
      tags,
      category,
      status, 
      readingTime, 
      updatedAt: new Date() 
    },
    { new: true }
  );

  return NextResponse.json(blog);
}

// DELETE single blog
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  console.log("DELETE request received");
  await connectDB();
  const { id } = await context.params;
  await Blog.findByIdAndDelete(id);
  return NextResponse.json({ message: "Blog Deleted" });
}
