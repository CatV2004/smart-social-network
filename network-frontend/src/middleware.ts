import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/verify-email", "/unauthorized"];
const NESTJS_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("=== MIDDLEWARE START ===");
  console.log("Pathname:", pathname);

  // Bỏ qua static files và API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|css|js|mp4)$/)
  ) {
    console.log("Skipping static file");
    return NextResponse.next();
  }

  // Public routes → cho qua
  if (publicRoutes.includes(pathname)) {
    console.log("Public route - allowing access");
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  console.log("Token exists:", !!token);

  // Không có token → redirect đến login
  if (!token) {
    console.log("No token - redirecting to login");
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Lấy role từ endpoint - SỬA THÀNH BACKEND URL
    console.log("Fetching user role from backend API");
    const userRole = await getUserRole(token);
    console.log("User role:", userRole);

    // Không lấy được role → token invalid → xóa token và redirect
    if (!userRole) {
      console.log("Invalid token - redirecting to login");
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      return response;
    }

    // Kiểm tra admin routes
    if (pathname.startsWith("/admin")) {
      console.log("Admin route detected");
      if (userRole !== "ADMIN") {
        console.log("User is not ADMIN - redirecting to unauthorized");
        const unauthorizedUrl = req.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
      } else {
        console.log("User is ADMIN - allowing access");
      }
    }

    console.log("Allowing access to non-admin route");
    return NextResponse.next();

  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

async function getUserRole(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${NESTJS_BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    console.log("Auth API status:", res.status);

    if (!res.ok) {
      console.log("API response not OK");
      return null;
    }

    const data = await res.json();
    console.log("API response data:", data);
    return data.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};