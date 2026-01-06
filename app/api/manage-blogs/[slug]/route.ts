import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";

const isDev = process.env.NODE_ENV === "development";

// GET single blog (READ)
export async function GET(_: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await context.params;
    isDev && console.log("Fetching blog with slug:", slug);

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    isDev && console.error("[GET API] Blog fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// PUT single blog (UPDATE)
export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await context.params;
    const { title, content, tags, category, status } = await req.json();

    // Validation
    if (!title || !content || !tags?.length || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const titleWords = title.trim().split(/\s+/).length;
    if (titleWords > 10) {
      return NextResponse.json({ message: "Title should be less than 10 words" }, { status: 400 });
    }

    // Compute reading time
    const contentWords = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(contentWords / 200));

    // Find and update blog
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Update fields
    blog.title = title;
    blog.content = content;
    blog.tags = tags;
    blog.category = category;
    blog.status = status;
    blog.readingTime = readingTime;
    blog.updatedAt = new Date();

    // Handle publish/draft status updates
    if (status === "published" && !blog.publishedAt) {
      blog.publishedAt = new Date();
    } 
    
    if (status === "draft" && blog.publishedAt) {
      blog.publishedAt = null;
    }

    // Save (pre-save hook will re-generate slug if title changed)
    await blog.save();

    return NextResponse.json(blog, { status: 200 });
  } catch (err) {
    isDev && console.error("[PUT API] Blog update error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}


// DELETE single blog
export async function DELETE(_: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await context.params;

    const deleted = await Blog.findOneAndDelete({ slug});

    if (!deleted) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({ message: "Blog Deleted" });
  } catch (err) {
    isDev && console.error("[DELETE API] Blog error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
