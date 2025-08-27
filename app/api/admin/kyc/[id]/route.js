import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import UserKYC from "@/model/UserKYC.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { status, remark = "" } = await request.json();
    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }
    const kyc = await UserKYC.findByIdAndUpdate(
      params.id,
      { status, adminRemark: remark },
      { new: true }
    ).populate("user", "email");
    if (!kyc) {
      return NextResponse.json({ success: false, message: "KYC not found" }, { status: 404 });
    }
    if (kyc.user?.email) {
      const subject = `KYC ${status}`;
      const text = status === "approved"
        ? "Your KYC has been approved."
        : `Your KYC has been rejected. ${remark ? "Reason: " + remark : ""}`;
      try {
        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: kyc.user.email,
          subject,
          text,
        });
      } catch (err) {
        console.error("Failed to send mail", err);
      }
    }
    return NextResponse.json({ success: true, kyc });
  } catch (error) {
    console.error("Update KYC error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
