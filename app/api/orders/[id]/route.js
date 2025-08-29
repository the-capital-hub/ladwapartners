import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";

export async function GET(request, { params }) {
        try {
                await dbConnect();

                const order = await Order.findById(params.id)
                        .populate("userId", "firstName lastName email mobile")
                        .populate("products.productId", "name images price")
                        .populate(
                                "couponApplied.couponId",
                                "code discountType discountValue"
                        );

                if (!order) {
                        return NextResponse.json(
                                { success: false, message: "Order not found" },
                                { status: 404 }
                        );
                }

                return NextResponse.json({ success: true, order });
        } catch (error) {
                console.error("Error fetching order:", error);
                return NextResponse.json(
                        { success: false, message: "Failed to fetch order" },
                        { status: 500 }
                );
        }
}
