import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRY = "1h";
const AUTH_MODULE_APP_URL = process.env.AUTH_MODULE_APP_URL as string;
// const AUTH_MODULE_APP_URL = process.env.AUTH_MODULE_APP_URL; OR?

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: object) {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {expiresIn: JWT_EXPIRY}
  )
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export function getResetPasswordToken(userId: string) {
  return jwt.sign(
    { _id: new ObjectId(userId) },
    JWT_SECRET,
    { expiresIn: "15m" }
  )
}

export function getResetPasswordURL(token: string) {
  return `${AUTH_MODULE_APP_URL}/reset-password?token=${token}`;
}

// Also check existing email (in sign up page)
export async function getUserByEmail(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db("auth-module");
    return await db.collection("users").findOne({ email });
  } catch (err) {
    console.error("❌ Error finding user by email:", err);
    return null;
  }
}

export async function getUserById(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("auth-module");
    return await db.collection("users").findOne({ _id: new ObjectId(userId) });
  } catch (err) {
    console.error("❌ Error findng user by ID:", err);
    return null;
  }
}

export async function updatePassword(userId: string, newPassword: string) {
  const hashed = await hashPassword(newPassword);
  const client = await clientPromise;
  const db = client.db("auth-module");
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashed } }
  );
}

export function makeNewSession(response: NextResponse, token: string) {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  })
}

export function invalidateSession(response: NextResponse) {
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
}
