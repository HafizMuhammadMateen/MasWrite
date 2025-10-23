import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET!;
const JWT_EXPIRY = "1h";
const DB_NAME = "auth-module";
const USERS_COLLECTION = "users";

// ==========================
// 🧾 JWT Utilities
// ==========================
export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_AUTH_SECRET, { expiresIn: JWT_EXPIRY });
}

export function signResetPasswordToken(payload: object): string {
  return jwt.sign(payload, JWT_AUTH_SECRET, { expiresIn: "15m" });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_AUTH_SECRET) as { userId: string };
}

// ==========================
// 👤 User Data Utilities
// ==========================
export async function getUserById(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return db.collection(USERS_COLLECTION).findOne({ _id: new ObjectId(userId) });
  } catch (error) {
    if (process.env.NODE_ENV === "development") 
      console.error("❌ Error finding user by ID:", error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(USERS_COLLECTION).findOne({ email });
}

export async function createUser(userName: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    userName,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(USERS_COLLECTION).insertOne(newUser);
}

export async function updatePassword(userId: string, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  await db.collection(USERS_COLLECTION).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ==========================
// 🍪 Session Management
// ==========================
export function createSession(response: NextResponse, token: string): void {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
}

export function destroySession(response: NextResponse): void {
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
}
