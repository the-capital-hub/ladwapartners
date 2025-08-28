import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import UserKYC from "@/model/UserKYC.js";

export async function GET() {
  try {
    await dbConnect();
    const kycs = await UserKYC.find().populate("user", "email firstName lastName");
    return NextResponse.json({ success: true, data: kycs });
  } catch (error) {
    console.error("List KYC error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
