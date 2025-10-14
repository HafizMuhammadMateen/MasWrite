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
function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json() as { title: string; content: string; };

  const slug = slugify(data.title);
  const isExisting  = await Post.findOne({ slug });
  if(isExisting) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

  const post = await Post.create({ ...data, slug });
  return NextResponse.json(post);
}
