import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog, { slugify } from "@/lib/models/Blog";
import { verifyToken } from "@/utils/authHelpers";
import { error } from "@/utils/apiResponse";
import mongoose from "mongoose";

// Dublicate bulk blogs
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { blogsToDublicate } = await req.json();

    // Validation
    const validationBulk = blogsToDublicate.some((blog: any) => !blog.title || !blog.content || !blog.tags.length || !blog.category);
    if (validationBulk) return error("Missing required fields", 400);

    if (!Array.isArray(blogsToDublicate) || blogsToDublicate.length === 0) {
      return error("No blogs selected for duplication", 400);
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

    const now = new Date();

    // dublicate blogs (slugs will be auto-generated in pre-save hook)
    const blogsToInsert = blogsToDublicate.map((blog) => {
    const _id = new mongoose.Types.ObjectId();
    return {
      ...blog,
      _id,
      slug: slugify(blog.title, _id.toString()),
      createdAt: now,
      updatedAt: now,
      publishedAt: blog.status === "published" ? now : null,
     };
    });

    await Blog.insertMany(blogsToInsert);

    return NextResponse.json(blogsToInsert, { status: 201 });
  } catch (err) {
    console.error("[POST API] Blog dublication error:", err);
    return error("Something went wrong", 500);
  }
}