import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Invalidating session
    const response = NextResponse.json({ message: "Logout successfully." });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      maxAge: 0,
      path: "/",
    })

    return response;
  } catch (e) {
    return NextResponse.json({error: "Something went wrong"}, {status: 500})
  }
}