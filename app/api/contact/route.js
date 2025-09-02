import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import ContactMessage from "@/model/ContactMessage.js";
import { sendMail } from "@/lib/mail.js";

export async function POST(request) {
  try {
    await dbConnect();
    const { firstName, lastName, email, phone, message } = await request.json();

    const contact = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    const html = `
      <p>You have received a new contact request on Ladwa Partners.</p>
      <p><strong>Name:</strong> ${firstName || ""} ${lastName || ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    try {
      await sendMail({
        to: "dev.capitalhub@gmail.com",
        subject: "New Contact Message",
        html,
      });
    } catch (mailError) {
      console.error("Failed to send contact email:", mailError);
    }

    return NextResponse.json({ success: true, message: "Message sent successfully", data: contact });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 });
  }
}
