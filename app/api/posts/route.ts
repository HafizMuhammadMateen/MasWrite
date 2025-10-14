import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Post from "@/lib/models/Post";

// Get all posts
export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

// Create new posts
export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json() as { title: string; content: string };
  const post = await Post.create(data);
  return NextResponse.json(post);
}
