import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET as string,
);

// public — anyone can access
const publicRoutes = ["/"];

// authenticated — must be logged in (any role)
const protectedRoutes = ["/dashboard", "/calendar", "/profile"];

// admin only — must be logged in AND be admin
const adminRoutes = ["/leads", "/mail", "/templates", "/users"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = publicRoutes.includes(pathname);
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r));

  // if route is public — let everyone through
  if (isPublic) {
    // but if already logged in → redirect to dashboard
    const accessToken = req.cookies.get("accessToken")?.value;
    if (accessToken) {
      try {
        await jwtVerify(accessToken, ACCESS_SECRET);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // token invalid — let them stay on login page
      }
    }
    return NextResponse.next();
  }

  // for protected and admin routes — verify token
  // middleware can't read localStorage so we use a cookie for accessToken too
  const accessToken = req.cookies.get("accessToken")?.value;

  let isValid = false;
  let role: string | null = null;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, ACCESS_SECRET);
      isValid = true;
      role = payload.role as string;
    } catch {
      isValid = false;
    }
  }

  // not logged in → redirect to login
  if ((isProtected || isAdmin) && !isValid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // logged in but not admin → redirect to unauthorized
  if (isAdmin && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/calendar/:path*",
    "/profile/:path*",
    "/leads/:path*",
    "/mail/:path*",
    "/templates/:path*",
    "/users/:path*",
  ],
};