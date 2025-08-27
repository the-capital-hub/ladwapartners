import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req) {
        const token = req.cookies.get("auth_token")?.value;
        const { pathname } = req.nextUrl;

        // Allow access to public admin auth routes
        const adminAuthPaths = [
                "/admin/login",
                "/admin/signup",
                "/api/admin/auth/login",
                "/api/admin/auth/register",
        ];
        if (adminAuthPaths.some((p) => pathname.startsWith(p))) {
                return NextResponse.next();
        }

        try {
                const decoded = verifyToken(token);

                // Additional checks for admin-only routes
                if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
                        if (decoded.userType !== "admin") {
                                if (pathname.startsWith("/api")) {
                                        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                }
                                return NextResponse.redirect(new URL("/admin/login", req.url));
                        }
                }

                return NextResponse.next();
        } catch {
                if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
                        if (pathname.startsWith("/api")) {
                                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                        }
                        return NextResponse.redirect(new URL("/admin/login", req.url));
                }
                return NextResponse.redirect(new URL("/login", req.url));
        }
}

// Apply to protected routes
export const config = {
        matcher: [
                "/dashboard/:path*",
                "/account",
                "/admin/:path*",
                "/api/admin/:path*",
        ],
};
