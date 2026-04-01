import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

async function handler(req: NextRequest) {
  // Get the path after /api/auth/
  const pathname = req.nextUrl.pathname;
  const backendUrl = new URL(pathname + req.nextUrl.search, BACKEND_URL);

  // Forwarding the request to the backend
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

    // Get all Set-Cookie headers
    const setCookieHeaders = response.headers.getSetCookie?.() || [];

    console.log("[Auth Proxy] Response status:", response.status);
    console.log(
      "[Auth Proxy] Set-Cookie headers count:",
      setCookieHeaders.length,
    );

    // Create a clean response without backend's CORS headers
    const nextResponse = new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy content-type header
    const contentType = response.headers.get("content-type");
    if (contentType) {
      nextResponse.headers.set("content-type", contentType);
    }

    // Manually set each Set-Cookie header
    setCookieHeaders.forEach((cookie) => {
      // For same-origin cookies, we can use Lax instead of None
      // Remove cross-origin cookie attributes
      const modifiedCookie = cookie
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax")
        .replace(/;\s*Secure;/gi, ";")
        .replace(/;\s*Secure$/gi, "")
        .replace(/;\s*Partitioned;/gi, ";")
        .replace(/;\s*Partitioned$/gi, "")
        .replace(/__Secure-/gi, ""); // Remove __Secure- prefix

      console.log(
        "[Auth Proxy] Modified cookie:",
        modifiedCookie.substring(0, 50) + "...",
      );
      nextResponse.headers.append("Set-Cookie", modifiedCookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("[Auth Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to auth server" },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
