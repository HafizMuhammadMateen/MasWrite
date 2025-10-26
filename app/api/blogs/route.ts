import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { slugify } from "@/utils/blogsHelpers";
import { verifyToken } from "@/utils/authHelpers";

const isDev = process.env.NODE_ENV === "development";

// Get all blogs
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Extract query params
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const author = searchParams.get("author");
    const tags = searchParams.get("tags")?.split(",") || [];
    const sort = searchParams.get("sort") || "publishedAt";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    // Build filter
    const filter: any = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (author) filter.author = author;
    if (tags.length > 0) filter.tags = { $in: tags };
    if (status) filter.status = status;
    if (category) filter.category = category;

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
  } catch (err) {
    isDev && console.error("[GET API] Fetch all blogs error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}


// Create new blog(s)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, content, tags, category, status } = await req.json();

    if (!title || !content || !tags?.length || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const titleWords = title.trim().split(/\s+/).length;
    if (titleWords > 10) {
      return NextResponse.json({ message: "Title should be less than 10 words" }, { status: 400 });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decodedToken = verifyToken(token);
    if (!decodedToken?.userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const slug = slugify(title);
    let blog = await Blog.findOne({ slug, author: decodedToken.userId });

    const contentWords = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(contentWords / 200));
    const now = new Date();

    if (blog) {
      // Update existing blog
      blog.content = content;
      blog.tags = tags;
      blog.category = category;
      blog.status = status;
      blog.readingTime = readingTime;
      blog.updatedAt = now;

      // Only set publishedAt if changing to published and it wasn't already published
      if (status === "published" && !blog.publishedAt) blog.publishedAt = now;

      // Clear publishedAt if switching to draft
      if (status === "draft") blog.publishedAt = null;

      await blog.save();
    } else {
      // Create new blog
      const isExisting = await Blog.findOne({ slug });
      if (isExisting) {
        return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
      }

      blog = await Blog.create({
        title,
        content,
        slug,
        author: decodedToken.userId,
        status,
        tags,
        category,
        readingTime,
        updatedAt: now,
        publishedAt: status === "published" ? now : null,
      });
    }

    return NextResponse.json(blog);
  } catch (err) {
    isDev && console.error("[POST API] Blog creation error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
