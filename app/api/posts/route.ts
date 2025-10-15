import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Post from "@/lib/models/Post";
import { slugify } from "@/utils/postsHelpers";

// Get all posts
export async function GET(req: NextRequest) {
  await connectDB();

  // Extract query params
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10; // you can change this later
  const author = searchParams.get("author");
  const tags = searchParams.get("tags")?.split(",") || [];
  const sort = searchParams.get("sort") || "publishedAt";

  // Build filter
  const filter: any = {};

  if (q) filter.$text = { $search: q };
  if (author) filter.author = author;
  if (tags.length > 0) filter.tags = { $in: tags };

  // Pagination setup
  const total = await Post.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  // Query posts
  const posts = await Post.find(filter)
    .sort({ [sort]: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return NextResponse.json({
    posts,
    page,
    totalPages,
    total,
  });
}

// Create new post(s)
export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json() as { title: string; content: string; };

  const slug = slugify(data.title);
  const isExisting  = await Post.findOne({ slug });
  if(isExisting) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

  const words = data.content.split(/\s+/).length; 
  const readingTime = Math.max(1, Math.round(words / 200));

  const post = await Post.create({ ...data, slug, readingTime });
  return NextResponse.json(post);
}
