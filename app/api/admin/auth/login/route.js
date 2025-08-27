import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User.js";
import { createToken } from "@/lib/auth";
import { serialize } from "cookie";

export async function POST(req) {
        await dbConnect();
        const { email, password } = await req.json();

        // Only allow the dedicated admin account to access the admin panel
        if (email !== "admin@safetyonline.com") {
                return Response.json({ message: "Unauthorized" }, { status: 403 });
        }

        const user = await User.findOne({ email, userType: "admin" });

        if (!user || !(await user.comparePassword(password))) {
                return Response.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Issue a token that remains valid for 3 days
        const token = createToken(user, "3d");
        const cookie = serialize("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 3, // 3 days
        });

        return new Response(JSON.stringify({ message: "Login successful" }), {
                status: 200,
                headers: { "Set-Cookie": cookie },
        });
}
