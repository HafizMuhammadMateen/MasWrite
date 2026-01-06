import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/lib/models/Blog";

const isDev = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    await connectDB();

    // Only return published blogs
    const blogs = await Blog.find({ status: "published" })
      .populate("author", "userName email")
      .sort({ publishedAt: -1 });

    return NextResponse.json({ blogs });
  } catch (err) {
    isDev && console.error("[GET API] Public blogs fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
