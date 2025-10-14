import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Post from "@/lib/models/Post";

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
  const { slug } = await context.params;
  const data = await req.json() as { title: string; content: string };
  const post = await Post.findOneAndUpdate({ slug }, data, { new: true });
  return NextResponse.json(post);
}

// Delete single post
export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params;
  await Post.findOneAndDelete({ slug });
  return NextResponse.json({ message: "Post Deleted" });
}
