import { NextResponse } from "next/server";

async function verifyJwt(token) {
        try {
                const secret = new TextEncoder().encode(
                        process.env.JWT_SECRET || "your-secret-key",
                );
                const [headerB64, payloadB64, signatureB64] = token.split(".");
                const data = `${headerB64}.${payloadB64}`;

                const key = await crypto.subtle.importKey(
                        "raw",
                        secret,
                        { name: "HMAC", hash: "SHA-256" },
                        false,
                        ["verify"],
                );
                const signature = base64UrlToUint8Array(signatureB64);
                const valid = await crypto.subtle.verify(
                        "HMAC",
                        key,
                        signature,
                        new TextEncoder().encode(data),
                );

                if (!valid) {
                        return null;
                }

                const payloadJSON = new TextDecoder().decode(
                        base64UrlToUint8Array(payloadB64),
                );
                return JSON.parse(payloadJSON);
        } catch {
                return null;
        }
}

function base64UrlToUint8Array(str) {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        const padded = base64 + (pad ? "=".repeat(4 - pad) : "");
        const binary = atob(padded);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
}

export async function middleware(req) {
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

        const decoded = token ? await verifyJwt(token) : null;

        if (decoded) {
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
        }

        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
                if (pathname.startsWith("/api")) {
                        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                }
                return NextResponse.redirect(new URL("/admin/login", req.url));
        }
        return NextResponse.redirect(new URL("/login", req.url));
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
