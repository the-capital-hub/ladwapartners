import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Review from "@/model/Review.js";
import Order from "@/model/Order.js";
import { verifyToken } from "@/lib/auth.js";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
	await dbConnect();
	const { id } = await params;

	try {
		const product = await Product.findById(id).populate({
			path: "reviews",
			populate: { path: "user", select: "firstName lastName" },
		});

		if (!product) {
			return Response.json({ message: "Product not found" }, { status: 404 });
		}

		const twoDays = 2 * 24 * 60 * 60 * 1000;
		const filteredReviews = [];

		for (const review of product.reviews) {
			const order = await Order.findOne({
				userId: review.user._id,
				"products.productId": product._id,
				paymentStatus: "paid",
				paymentCompletedAt: { $exists: true },
			}).sort({ paymentCompletedAt: -1 });

			if (order && review.createdAt - order.paymentCompletedAt >= twoDays) {
				filteredReviews.push(review);
			}
		}

		return Response.json({ reviews: filteredReviews });
	} catch (error) {
		console.error("Fetch reviews error:", error);
		return Response.json(
			{ message: "Failed to fetch reviews" },
			{ status: 500 }
		);
	}
}

export async function POST(req, { params }) {
	await dbConnect();

	try {
		const cookieStore = cookies();
		const token = cookieStore.get("auth_token")?.value;

		if (!token) {
			return Response.json(
				{ message: "Authentication required" },
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);
		const { rating, comment } = await req.json();

		// Validate input
		if (!rating || !comment) {
			return Response.json(
				{ message: "Rating and comment are required" },
				{ status: 400 }
			);
		}

		if (rating < 1 || rating > 5) {
			return Response.json(
				{ message: "Rating must be between 1 and 5" },
				{ status: 400 }
			);
		}

		// Check if product exists
		const product = await Product.findById(params.id);
		if (!product) {
			return Response.json({ message: "Product not found" }, { status: 404 });
		}

		// Create review
		const review = new Review({
			user: decoded.id,
			rating,
			comment,
		});

		await review.save();

		// Add review to product
		product.reviews.push(review._id);
		await product.save();

		// Populate the review with user data
		await review.populate("user", "firstName lastName");

		return Response.json({ message: "Review added successfully", review });
	} catch (error) {
		console.error("Add review error:", error);
		return Response.json({ message: "Failed to add review" }, { status: 500 });
	}
}
