import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";
import { sendMail } from "@/lib/mail";

export async function GET(request, { params }) {
	try {
		await dbConnect();

                const order = await Order.findById(params.id)
                        .populate("userId", "firstName lastName email mobile")
                        .populate("products.productId", "name images price")
                        .populate("couponApplied.couponId", "code discountType discountValue");

		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			order,
		});
	} catch (error) {
		console.error("Error fetching order:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch order" },
			{ status: 500 }
		);
	}
}

export async function PUT(request, { params }) {
	try {
		await dbConnect();

		const updateData = await request.json();

                const order = await Order.findByIdAndUpdate(params.id, updateData, {
                        new: true,
                        runValidators: true,
                })
                        .populate("userId", "firstName lastName email")
                        .populate("products.productId", "name images");

		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

                if (updateData.status && order.userId?.email) {
                        const html = `
                                <div style="font-family:Arial,sans-serif;font-size:16px;color:#333;">
                                        <h2 style="color:#4f46e5;">Order Status Updated</h2>
                                        <p>Hi ${order.userId.firstName},</p>
                                        <p>Your order <strong>${order.orderNumber}</strong> status has been updated to <strong>${order.status.toUpperCase()}</strong>.</p>
                                        <p style="margin-top:20px;">Best regards,<br/>Ladwa Partners</p>
                                </div>
                        `;
                        try {
                                await sendMail({
                                        to: order.userId.email,
                                        subject: `Order ${order.orderNumber} - ${order.status}`,
                                        html,
                                });
                        } catch (mailErr) {
                                console.error("Order status email error:", mailErr);
                        }
                }

                return NextResponse.json({
                        success: true,
                        message: "Order updated successfully",
                        order,
                });
	} catch (error) {
		console.error("Error updating order:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update order" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		await dbConnect();

		const order = await Order.findByIdAndDelete(params.id);

		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Order deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting order:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete order" },
			{ status: 500 }
		);
	}
}
