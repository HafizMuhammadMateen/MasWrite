import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true  },
  password: { type: String, required: true },
}, { timestamps: true });

export default models.User || mongoose.model("User", userSchema);
