import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET as string,
);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

const publicRoutes = ["/"];
const protectedRoutes = ["/dashboard", "/calendar", "/profile"];
const adminRoutes = ["/leads", "/mail", "/templates", "/users"];

// NEW: try to refresh token silently
const tryRefresh = async (req: NextRequest): Promise<string | null> => {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) return null;

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`, // forward cookie to backend
      },
    });

    if (!refreshRes.ok) return null;

    const data = await refreshRes.json();
    return data.accessToken ?? null;
  } catch {
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = publicRoutes.includes(pathname);
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r));

  // public route
  if (isPublic) {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (accessToken) {
      try {
        await jwtVerify(accessToken, ACCESS_SECRET);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // expired — try refresh
        const newToken = await tryRefresh(req);
        if (newToken) {
          const res = NextResponse.redirect(new URL("/dashboard", req.url));
          res.cookies.set("accessToken", newToken, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
            maxAge: 2 * 60 * 60,
            path: "/",
          });
          return res;
        }
      }
    }
    return NextResponse.next();
  }

  // protected or admin route
  const accessToken = req.cookies.get("accessToken")?.value;

  let isValid = false;
  let role: string | null = null;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, ACCESS_SECRET);
      isValid = true;
      role = payload.role as string;
    } catch {
      // NEW: accessToken expired → try refresh silently
      const newToken = await tryRefresh(req);

      if (newToken) {
        try {
          const { payload } = await jwtVerify(
            newToken,
            ACCESS_SECRET,
          );
          isValid = true;
          role = payload.role as string;

          // NEW: set new accessToken cookie and continue
          const res = NextResponse.next();
          res.cookies.set("accessToken", newToken, {
            httpOnly: false, // must be false so JS can read it
            secure: true,
            sameSite: "none",
            maxAge: 2 * 60 * 60,
            path: "/",
          });

          // also update localStorage via a header the client can read
          res.headers.set("x-new-access-token", newToken);
          return res;
        } catch {
          isValid = false;
        }
      }
    }
  }

  // no accessToken at all → try refresh
  if (!accessToken && (isProtected || isAdmin)) {
    const newToken = await tryRefresh(req);

    if (newToken) {
      try {
        const { payload } = await jwtVerify(newToken, ACCESS_SECRET);
        const res = NextResponse.next();
        res.cookies.set("accessToken", newToken, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 2 * 60 * 60,
          path: "/",
        });
        res.headers.set("x-new-access-token", newToken);

        // check admin
        if (isAdmin && payload.role !== "admin") {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return res;
      } catch {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  if ((isProtected || isAdmin) && !isValid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

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