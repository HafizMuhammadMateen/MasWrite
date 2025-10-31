import mongoose, { Schema } from "mongoose";

function slugify(title: string, blogId: string) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return `${slug}-${blogId}`;
}

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
    readingTime: { type: Number },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    category: {
      type: String,
      enum: [
        "Web Development",
        "UI/UX",
        "JavaScript",
        "React",
        "Next.js",
        "Backend",
        "Databases",
        "DevOps",
        "AI/ML",
        "Other",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

// Add indexes
blogSchema.index({ createdAt: -1 }); // for sorting/pagination
blogSchema.index({ title: "text", content: "text" }); // for search

// Pre-save hook to generate slug
blogSchema.pre("save", function (next) {
  if (this.isNew && this.title) {
    // If the document is new and title is provided
    const blogId = this._id.toString(); // get generated ObjectId
    this.slug = slugify(this.title, blogId);
  }
  next();
});

export default mongoose.models["Blog"] || mongoose.model("Blog", blogSchema);
