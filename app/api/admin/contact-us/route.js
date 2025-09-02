import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import ContactMessage from "@/model/ContactMessage.js";

export async function GET() {
  try {
    await dbConnect();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
