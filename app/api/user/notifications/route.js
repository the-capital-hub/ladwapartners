import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import User from "@/model/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.js";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("notificationPreferences");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, preferences: user.notificationPreferences || {} });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    const body = await req.json();
    const preferences = body.preferences || {};
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { notificationPreferences: preferences },
      { new: true, runValidators: false, select: "notificationPreferences" }
    );
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, preferences: user.notificationPreferences || {} });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
