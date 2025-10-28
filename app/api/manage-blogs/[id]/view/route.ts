import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";

export async function POST(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const isDev = process.env.NODE_ENV === "development";
  try {
    await connectDB();
    const { id } = await context.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, projection: { views: 1 } } // return only views field
    );

    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({ views: blog.views });
  } catch (err) {
    isDev && console.error("[POST API] Increment blog views error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

