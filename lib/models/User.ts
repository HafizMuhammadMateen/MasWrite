import { User } from "@/lib/types/user";
import clientPromise from "@/lib/mongodb";

export async function getUserCollection() {
  const client = await clientPromise;
  return client.db().collection<User>("users");
}

// import mongoose, { Schema, models } from "mongoose";

// const userSchema = new Schema({
//   email: { type: String, required: true },
//   userName: { type: String, required: true },
//   password: { type: String, required: true },
// }, { timestamps: true });

// export default models.User || mongoose.model("User", userSchema);
