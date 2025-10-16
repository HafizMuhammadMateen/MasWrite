import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { slugify } from "@/utils/blogsHelpers";
import { error } from "console";
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
  const data = await req.json() as { title: string; content: string; };

  const slug = slugify(data.title);
  const isExisting  = await Blog.findOne({ slug });
  if(isExisting) return error("⚠️ Slug already exists", 400);

  const words = data.content.split(/\s+/).length; 
  const readingTime = Math.max(1, Math.round(words / 200));

  const token = req.cookies.get("token")?.value;
  if (!token) return error("❌ Unauthorized", 401);

  const decodedToken = verifyToken(token);
  if(!decodedToken || !decodedToken.userId) return error("❌ Invalid token", 401); 

  const blog = await Blog.create({ 
    ...data, 
    slug, 
    readingTime,
    author: decodedToken.userId, 
  });
  return NextResponse.json(blog);
}
