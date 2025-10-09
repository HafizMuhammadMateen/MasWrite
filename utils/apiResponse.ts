import { NextResponse } from "next/server";

export function success(message: string, status: number = 200, data?: any) {
  return NextResponse.json({ message, ...(data && {data}) }, { status });
}

export function error(message: string, status: number = 400, details?: any) {
  console.error("❌", message, details || "");
  return NextResponse.json({ error: message, ...(details && {details}) }, { status });
}