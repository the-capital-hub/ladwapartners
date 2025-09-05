import { dbConnect } from "@/lib/dbConnect";
import { sendOtpMobile } from "@/lib/sendMobileOtp";
import Verification from "@/model/Verification.js";
import { NextResponse } from "next/server";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  await dbConnect();
  const { mobile } = await req.json();
  const code = generateCode();

  if (!mobile) {
    return NextResponse.json(
      { message: "Phone number is required" },
      { status: 400 }
    );
  }

  await Verification.findOneAndUpdate(
    { mobile },
    { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true }
  );

  await sendOtpMobile(mobile, code);

  return NextResponse.json({
    message: "Verification code sent",
    success: true,
  });
}
