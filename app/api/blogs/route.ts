import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { slugify } from "@/utils/blogsHelpers";
import { verifyToken } from "@/utils/authHelpers";

// Get all blogs
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
  const total = await Blog.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  // Query blogs
  const blogs = await Blog.find(filter)
    .populate("author", "userName email")
    .sort({ [sort]: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return NextResponse.json({
    blogs,
    page,
    totalPages,
    total,
  });
}

// Create new blog(s)
export async function POST(req: NextRequest) {
  await connectDB();

  const { title, content, tags, status } = await req.json();

  if (!title || !content || !tags?.length) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const slug = slugify(title);
  const isExisting = await Blog.findOne({ slug });
  if (isExisting) {
    return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
  }

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decodedToken = verifyToken(token);
  if (!decodedToken || !decodedToken.userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const words = content.split(/\s+/).length; 
  const readingTime = Math.max(1, Math.round(words / 200));

  const blog = await Blog.create({
    title,
    content,
    slug,
    author: decodedToken.userId,
    publishedAt: new Date(),
    readingTime,
    status,
    tags,
  });

  return NextResponse.json(blog);
}

