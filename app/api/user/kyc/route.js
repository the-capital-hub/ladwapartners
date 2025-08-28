import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import UserKYC from "@/model/UserKYC.js";
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
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
    const kyc = await UserKYC.findOne({ user: decoded.id });
    if (!kyc) {
      return NextResponse.json({ success: true, status: "not_submitted" });
    }
    return NextResponse.json({ success: true, status: kyc.status, kyc });
  } catch (error) {
    console.error("Get KYC error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
    const body = await request.json();
    const { gstin, ...details } = body;
    if (!gstin) {
      return NextResponse.json({ success: false, message: "GSTIN is required" }, { status: 400 });
    }
    const kyc = await UserKYC.findOneAndUpdate(
      { user: decoded.id },
      { gstin, details, status: "pending", adminRemark: "" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, kyc });
  } catch (error) {
    console.error("Submit KYC error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
