import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// ✅ Must be named `proxy` (or a default export function)
export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        console.log("No token found, redirecting to /login");
        return NextResponse.redirect(new URL("/admin-login", req.url));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Token verified, allowing access");
        return NextResponse.next();
    } catch (err) {
        console.log("Invalid token:", err);
        return NextResponse.redirect(new URL("/admin-login", req.url));
    }
}

// ✅ Apply to specific routes
export const config = {
    matcher: ["/user"], // Protect /hello route
};
