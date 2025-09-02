import { NextResponse } from "next/server";
import Order from "@/model/Order";
import Product from "@/model/Product";
import Cart from "@/model/Cart";
import User from "@/model/User";
import { dbConnect } from "@/lib/dbConnect.js";
import { sendMail } from "@/lib/mail";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF.js";
import { companyInfo } from "@/constants/companyInfo.js";

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

               // Send order placed email notification with invoice if enabled
               if (userId) {
                       try {
                               const user = await User.findById(userId).select(
                                       "email firstName notificationPreferences"
                               );
                               const prefs = user?.notificationPreferences;
                               if (
                                       user &&
                                       prefs?.channels?.email &&
                                       prefs?.settings?.["order-placed"]?.email
                               ) {
                                       const orderObj = order.toObject();
                                       const formatCurrency = (value) =>
                                               `₹${value.toLocaleString("en-IN", {
                                                       minimumFractionDigits: 2,
                                                       maximumFractionDigits: 2,
                                               })}`;
                                       const itemsHtml = orderObj.products
                                               .map(
                                                       (item) => `
                                               <tr>
                                                       <td style="padding:8px;border:1px solid #e5e7eb;">${item.productName}</td>
                                                       <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
                                                       <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(
                                                               item.totalPrice
                                                       )}</td>
                                               </tr>`
                                               )
                                               .join("");

                                       const address =
                                               orderObj.shipToAddress || orderObj.billToAddress || {};

                                       const html = `
                                       <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
                                               <h2 style="color:#4f46e5;">Thank you for your order!</h2>
                                               <p>Hi ${user.firstName},</p>
                                               <p>Your order <strong>${orderObj.orderNumber}</strong> has been placed successfully on ${new Date(
                                                       orderObj.orderDate
                                               ).toLocaleDateString()}.</p>
                                               <h3 style="margin-top:24px;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Order Summary</h3>
                                               <table style="width:100%;border-collapse:collapse;">
                                                       <thead>
                                                               <tr style="background:#f3f4f6;">
                                                                       <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Product</th>
                                                                       <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;">Qty</th>
                                                                       <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Total</th>
                                                               </tr>
                                                       </thead>
                                                       <tbody>
                                                               ${itemsHtml}
                                                       </tbody>
                                               </table>
                                               <table style="width:100%;margin-top:8px;">
                                                       <tr>
                                                               <td style="text-align:right;padding:4px;">Subtotal:</td>
                                                               <td style="text-align:right;padding:4px;">${formatCurrency(
                                                                       orderObj.subtotal
                                                               )}</td>
                                                       </tr>
                                                       ${
                                                               orderObj.gst?.total
                                                                       ? `<tr><td style="text-align:right;padding:4px;">GST:</td><td style="text-align:right;padding:4px;">${formatCurrency(
                                                                                 orderObj.gst.total
                                                                         )}</td></tr>`
                                                                       : ""
                                                       }
                                                       ${
                                                               orderObj.shippingCost
                                                                       ? `<tr><td style="text-align:right;padding:4px;">Shipping:</td><td style="text-align:right;padding:4px;">${formatCurrency(
                                                                                 orderObj.shippingCost
                                                                         )}</td></tr>`
                                                                       : ""
                                                       }
                                                       ${
                                                               orderObj.discount
                                                                       ? `<tr><td style="text-align:right;padding:4px;">Discount:</td><td style="text-align:right;padding:4px;">- ${formatCurrency(
                                                                                 orderObj.discount
                                                                         )}</td></tr>`
                                                                       : ""
                                                       }
                                                       <tr>
                                                               <td style="text-align:right;padding:4px;font-weight:bold;">Total:</td>
                                                               <td style="text-align:right;padding:4px;font-weight:bold;">${formatCurrency(
                                                                       orderObj.totalAmount
                                                               )}</td>
                                                       </tr>
                                               </table>
                                               <h3 style="margin-top:24px;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Shipping Address</h3>
                                               <p style="margin:0;">${address.name || ""}</p>
                                               <p style="margin:0;">${address.street || ""}</p>
                                               <p style="margin:0;">${address.city || ""}, ${address.state || ""} - ${address.zipCode || ""}</p>
                                               <p style="margin:0;">${address.country || ""}</p>
                                               <p style="margin-top:24px;">Your invoice is attached as a PDF for your records.</p>
                                               <p>If you have any questions, reply to this email or contact us at ${companyInfo.email}.</p>
                                               <p style="margin-top:16px;">Best regards,<br/>${companyInfo.name}</p>
                                       </div>
                                       `;

                                       const invoicePdf = await generateInvoicePDF(orderObj);

                                       await sendMail({
                                               to: user.email,
                                               subject: `Order Confirmed - ${orderObj.orderNumber}`,
                                               html,
                                               attachments: [
                                                       {
                                                               filename: `invoice-${orderObj.orderNumber}.pdf`,
                                                               content: invoicePdf,
                                                       },
                                               ],
                                       });
                               }
                       } catch (emailError) {
                               console.error("Order email error:", emailError);
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
