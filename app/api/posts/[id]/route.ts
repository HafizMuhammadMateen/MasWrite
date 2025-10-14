import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Post from "@/lib/models/Post";

// Get single post
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;
  const post = await Post.findById(id);
  return NextResponse.json(post);
}

// Update single post
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const data = await req.json() as { title: string; content: string };
  const { id } = await context.params;
  const post = await Post.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(post);
}

// Delete single post
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;
  await Post.findByIdAndDelete(id);
  return NextResponse.json({ message: "Post Deleted" });
}
