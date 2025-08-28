import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import User from "@/model/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.js";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { addressId } = params;

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    Object.assign(address, body);

    if (body.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) addr.isDefault = false;
      });
    }

    await user.save();

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Update address error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const { addressId } = params;

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    address.deleteOne();
    await user.save();

    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
