import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, default: "Anonymous" },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", postSchema);
