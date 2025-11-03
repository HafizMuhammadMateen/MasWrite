import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date, default: null }, // Only set when the post is actually published
    views: { type: Number, default: 0 },
    readingTime: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Add index
blogSchema.index({ createdAt: -1 }); // for sorting/pagination
blogSchema.index({ title: "text", content: "text" }); // for search

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
