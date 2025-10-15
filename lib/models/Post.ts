import mongoose, { Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date, default: null }, // Only set when the post is actually published
    views: { type: Number, default: 0 },
    readingTime: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Add index
postSchema.index({ createdAt: -1 }); // for sorting/pagination
postSchema.index({ title: "text", content: "text" }); // for search

export default mongoose.models.Post || mongoose.model("Post", postSchema);
