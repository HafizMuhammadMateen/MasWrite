import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Post from "@/lib/models/Post";
import { slugify } from "@/utils/postsHelpers";

// Get single post
export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params;
  const post = await Post.findOne({ slug });
  return NextResponse.json(post);
}

// Update single post
export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params; // old slug

  const data = await req.json() as { title: string; content: string };

  const newSlug = slugify(data.title);
  const words = data.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  const post = await Post.findOneAndUpdate(
    { slug }, // find by old slug
    { ...data, slug: newSlug, readingTime },
    { new: true }
  );

  return NextResponse.json(post);
}

// Delete single post
export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params;
  await Post.findOneAndDelete({ slug });
  return NextResponse.json({ message: "Post Deleted" });
}
