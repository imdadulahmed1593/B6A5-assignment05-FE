import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

async function handler(req: NextRequest) {
  // Get the path after /api/proxy/
  const pathname = req.nextUrl.pathname.replace("/api/proxy", "/api");

  // Build the backend URL
  const backendUrl = new URL(pathname + req.nextUrl.search, BACKEND_URL);

  // Forward the request to the backend
  const headers = new Headers(req.headers);

  // Remove headers that shouldn't be forwarded
  headers.delete("host");
  headers.delete("connection");

  try {
    const response = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    });

    // Get the response body
    const body = await response.text();

    // Create the response
    const nextResponse = new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy content-type header
    const contentType = response.headers.get("content-type");
    if (contentType) {
      nextResponse.headers.set("content-type", contentType);
    }

    return nextResponse;
  } catch (error) {
    console.error("[API Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to API server" },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
