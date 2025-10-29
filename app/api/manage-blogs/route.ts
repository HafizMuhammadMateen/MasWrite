import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
import { slugify } from "@/utils/blogsHelpers";
import { verifyToken } from "@/utils/authHelpers";
import { error } from "@/utils/apiResponse";

const isDev = process.env.NODE_ENV === "development";

// Get all blogs
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Verify user token
    const token = req.cookies.get("token")?.value;
    if (!token) return error("Unauthorized", 401);

    const decodedToken = verifyToken(token);
    if (!decodedToken?.userId) return error("Invalid token", 401);

    // 2. Extract and parse query parameters
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("q") || "";
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const blogsPerPage = parseInt(searchParams.get("limit") || "6", 10);
    const authorParam = searchParams.get("author");
    const tagsParam = searchParams.get("tags")?.split(",") || [];
    const sortBy = searchParams.get("sort") || "publishedAt";
    const statusParam = searchParams.get("status") || "";
    const categoryParam = searchParams.get("category") || "";

    // 3. Build MongoDB filter — only user's blogs
    const filter: Record<string, any> = { author: decodedToken.userId };

    if (searchQuery) filter.title = { $regex: searchQuery, $options: "i" };
    if (authorParam) filter.author = authorParam;
    if (tagsParam.length > 0) filter.tags = { $in: tagsParam };
    if (statusParam) filter.status = statusParam;
    if (categoryParam) filter.category = categoryParam;

    // 4. Pagination calculations
    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / blogsPerPage);

    // 5. Fetch paginated blogs
    const blogs = await Blog.find(filter)
      .populate("author", "userName email")
      .sort({ [sortBy]: -1 })
      .skip((currentPage - 1) * blogsPerPage)
      .limit(blogsPerPage);

    // 6. Counts for summary cards
    const [publishedCount, draftCount] = await Promise.all([
      Blog.countDocuments({ author: decodedToken.userId, status: "published" }),
      Blog.countDocuments({ author: decodedToken.userId, status: "draft" }),
    ]);

    // 7. Send structured response
    return NextResponse.json({
      blogs,
      currentPage,
      totalPages,
      totalBlogs,
      publishedCount,
      draftCount,
    });
  } catch (err) {
    isDev && console.error("[GET /api/manage-blogs] Error:", err);
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
