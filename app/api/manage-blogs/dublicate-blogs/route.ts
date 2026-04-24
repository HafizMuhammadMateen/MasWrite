import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog, { slugify } from "@/lib/models/Blog";
import { error } from "@/utils/apiResponse";
import { resolveUserId } from "@/lib/authenticateUser";
import mongoose from "mongoose";

// Dublicate bulk blogs
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { blogsToDublicate } = await req.json();

    if (!Array.isArray(blogsToDublicate) || blogsToDublicate.length === 0) {
      return error("No blogs selected for duplication", 400);
    }

    const hasInvalid = blogsToDublicate.some((blog: any) => !blog.title || !blog.content || !blog.tags?.length || !blog.category);
    if (hasInvalid) return error("Missing required fields", 400);

    // Auth check
    const userId = await resolveUserId(req);
    if (!userId) return error("Unauthorized", 401);

    const now = new Date();

    const blogsToInsert = blogsToDublicate.map((blog: any) => {
      const _id = new mongoose.Types.ObjectId();
      return {
        ...blog,
        _id,
        author: userId,
        slug: slugify(blog.title, _id.toString()),
        createdAt: now,
        updatedAt: now,
        publishedAt: blog.status === "published" ? now : null,
      };
    });

    await Blog.insertMany(blogsToInsert);

    return NextResponse.json(blogsToInsert, { status: 201 });
  } catch (err) {
    console.error("[POST API] Blog duplication error:", err);
    return error("Something went wrong", 500);
  }
}