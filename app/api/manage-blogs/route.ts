import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";
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
    const sortBy = searchParams.get("sort") || "updatedAt";
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
    isDev && console.error("[GET API] Blogs fetch Error:", err);
    return error("Something went wrong", 500);
  }
}

// Create new blog(s)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, content, tags, category, status } = await req.json();

    // Validation
    if (!title || !content || !tags?.length || !category) {
      return error("Missing required fields", 400);
    }

    const titleWords = title.trim().split(/\s+/).length;
    if (titleWords > 10) {
      return error("Title should be less than 10 words", 400);
    }

    // Auth check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return error("Unauthorized", 401);
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken?.userId) {
      return error("Invalid token", 401);
    }

    // Compute reading time
    const contentWords = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(contentWords / 200));
    const now = new Date();

    // Create blog (slug will be auto-generated in pre-save hook)
    const blog = new Blog({
      title,
      content,
      author: decodedToken.userId,
      status,
      tags,
      category,
      readingTime,
      updatedAt: now,
      publishedAt: status === "published" ? now : null,
    });

    await blog.save({ validateBeforeSave: false }); // triggers pre('save') before validation

    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    console.error("[POST API] Blog creation error:", err);
    return error("Something went wrong", 500);
  }
}

// Delete many blogs
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const ids = await req.json();

    if (!Array.isArray(ids) || ids.length === 0 ){
      return error("No ids provided", 400);
    }

    // Auth check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return error("Unauthorized", 401);
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken?.userId) {
      return error("Invalid token", 401);
    }

    // Delete blogs
    const deleteResult = await Blog.deleteMany({
      _id: { $in: ids },
    });

    if (deleteResult.deletedCount === 0) return error("Blogs not found", 404);
      
    return NextResponse.json({ message: "All selected blogs Deleted" });
  } catch (err) {
    isDev && console.error("[DELETE All API] Blogs error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// Note: PUT and DELETE handlers for single blog would go here as well, but are omitted for brevity.