import { NextResponse } from "next/server";

export function success(
  message: string,
  status: number = 200,
  data?: any
) {
  return NextResponse.json(
    {
      success: true,
      message,
      ...(data && { data }),
    },
    { status }
  );
}

export function error(
  message: string,
  status: number = 400,
  details?: any
) {
  if (process.env.NODE_ENV === "development") console.error("❌ [API Response] Error:", message, details || "");

  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}
