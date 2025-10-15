import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Post from "@/lib/models/Post";

export async function POST(_: NextRequest, context: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await context.params;

  const post = await Post.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true, projection: { views: 1 } } // return only views field
  );

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ views: post.views });
}
