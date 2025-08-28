import { NextResponse } from "next/server";
import Order from "@/model/Order";
import Product from "@/model/Product";
import Cart from "@/model/Cart";
import User from "@/model/User";
import { dbConnect } from "@/lib/dbConnect.js";
import nodemailer from "nodemailer";

export async function POST(req) {
	try {
		await dbConnect();

		const body = await req.json();
		const { orderData, userId, clearCart = false } = body;

		// Create order in database
		const order = new Order({
			...orderData,
			orderNumber: `ORD-${Date.now()}-${Math.random()
				.toString(36)
				.substr(2, 9)}`,
		});

		await order.save();

		// Update product stocks
		for (const item of orderData.products) {
			await Product.findByIdAndUpdate(item.productId, {
				$inc: { stocks: -item.quantity },
			});
		}

                // Clear cart if requested
                if (clearCart && userId) {
                        await Cart.findOneAndUpdate(
                                { user: userId },
                                { products: [], totalPrice: 0, appliedPromo: null }
                        );
                }

                // Send order placed email notification if enabled
                if (userId) {
                        const user = await User.findById(userId).select(
                                "email firstName notificationPreferences"
                        );
                        const prefs = user?.notificationPreferences;
                        if (
                                user &&
                                prefs?.channels?.email &&
                                prefs?.settings?.["order-placed"]?.email
                        ) {
                                const transporter = nodemailer.createTransport({
                                        service: "gmail",
                                        auth: {
                                                user: process.env.MAIL_USER,
                                                pass: process.env.MAIL_PASS,
                                        },
                                });

                                const html = `
                                        <div style="font-family:Arial,sans-serif;font-size:16px;color:#333;">
                                                <h2 style="color:#4f46e5;">Thank you for your order!</h2>
                                                <p>Hi ${user.firstName},</p>
                                                <p>Your order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
                                                <p>Total Amount: ₹${order.totalAmount}</p>
                                                <p>We will notify you once it ships.</p>
                                                <p style="margin-top:20px;">Best regards,<br/>Ladwa Partners</p>
                                        </div>
                                `;

                                await transporter.sendMail({
                                        from: process.env.MAIL_USER,
                                        to: user.email,
                                        subject: `Order Confirmed - ${order.orderNumber}`,
                                        html,
                                });
                        }
                }

		return NextResponse.json({
			success: true,
			orderId: order._id,
			orderNumber: order.orderNumber,
			order: order,
		});
	} catch (error) {
		console.error("Order creation error:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(req) {
	try {
		await dbConnect();

		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		const query = userId ? { userId } : {};
		const skip = (page - 1) * limit;

		const orders = await Order.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("products.productId", "title images");

		const total = await Order.countDocuments(query);

		return NextResponse.json({
			success: true,
			orders,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalOrders: total,
				hasNextPage: page < Math.ceil(total / limit),
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Orders fetch error:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
