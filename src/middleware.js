import { NextResponse } from "next/server"

export function middleware(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/webhook")) {

    console.log(request.method)

    if (request.method === "OPTIONS") {
      return NextResponse.json({}, { status: 204, headers: corsHeaders });
    }

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.append(key, value);
    });

  }

  return response
}

// export const config = {
//   matcher: "/api"
// }