import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  console.log(req.headers)
  const token = req.cookies.get("token")?.value;   // ✅ in your version this IS async
  // const token = cookieStore.get("token")?.value;
  
  if (!token) {
    console.log("token is:", token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  else{
    console.log("no token arrived!");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json({ message: "Access granted", user: decoded });
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
