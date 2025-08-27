import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User.js";
import { createToken } from "@/lib/auth";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(req) {
        await dbConnect();
        const { email, password } = await req.json();


        const user = await User.findOne({ email });

        if (
                !user ||
                user.userType !== "admin" ||
                !(await user.comparePassword(password))
        ) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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


        const res = NextResponse.json({ message: "Login successful" });
        res.headers.set("Set-Cookie", cookie);
        return res;

}
