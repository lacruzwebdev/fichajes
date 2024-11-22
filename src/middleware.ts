import { NextResponse, type NextRequest } from "next/server";
import { env } from "./env";

export default async function middleware(req: NextRequest) {
  if (env.NODE_ENV === "development") {
    const start = Date.now();
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    const result = NextResponse.next();
    const end = Date.now();
    console.log(
      `[DEBUG] Server Action from ${req.nextUrl.pathname} took ${end - start}ms to execute`,
    );
    return result;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "next-action" }],
    },
  ],
};
