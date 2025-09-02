// app/api/products/route.js

import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";

export async function GET(request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);

		// Extract query parameters
		const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");
                const stockStatus = searchParams.get("stockStatus");
                const discount = searchParams.get("discount");
                const categories = searchParams.get("categories");
                const category = searchParams.get("category");
                const subCategory = searchParams.get("subCategory");
                const search = searchParams.get("search");
                const type = searchParams.get("type");
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "12");
		const sort = searchParams.get("sort") || "createdAt";
		const order = searchParams.get("order") || "desc";

		// Build query
		const query = { published: true };

                // Category filter
                if (categories) {
                        query.category = { $in: categories.split(",") };
                } else if (category && category !== "all") {
                        query.category = category;
                }

                // Subcategory filter
                if (subCategory) {
                        // The subcategory value comes from the client in a slugified form
                        // where any sequence of non-alphanumeric characters (spaces, slashes, etc.)
                        // is replaced with "-". To match it against the stored subCategory string
                        // we build a regex that allows any non-alphanumeric characters in place
                        // of each hyphen. This ensures categories like "Bollards/ spring post" or
                        // "Q managers" are matched correctly.
                        const regexPattern = subCategory
                                .split("-")
                                .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                                .join("[^a-zA-Z0-9]+");

                        // Allow optional non-alphanumeric characters at the start and end so that
                        // values with accidental leading/trailing spaces or punctuation still match.
                        query.subCategory = {
                                $regex: new RegExp(
                                        `^[^a-zA-Z0-9]*${regexPattern}[^a-zA-Z0-9]*$`,
                                        "i"
                                ),
                        };
                }

		// Search filter
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ longDescription: { $regex: search, $options: "i" } },
			];
		}

		// Price range filter
                if (minPrice || maxPrice) {
                        const priceQuery = {};

                        if (minPrice) {
                                priceQuery.$gte = Number.parseInt(minPrice);
                        }
                        if (maxPrice) {
                                priceQuery.$lte = Number.parseInt(maxPrice);
                        }

                        query.price = priceQuery;
                }

                // Stock filter
                if (stockStatus === "inStock") {
                        query.inStock = true;
                        query.stocks = { $gt: 0 };
                } else if (stockStatus === "outOfStock") {
                        query.$or = [{ inStock: false }, { stocks: { $lte: 0 } }];
                }

		// Discount filter
                if (discount) {
                        const discountValue = Number.parseInt(discount);
                        query.$expr = {
                                $gte: [
                                        {
                                                $multiply: [
                                                        {
                                                                $divide: [
                                                                        { $subtract: ["$mrp", "$price"] },
                                                                        "$mrp",
                                                                ],
                                                        },
                                                        100,
                                                ],
                                        },
                                        discountValue,
                                ],
                        };
                }

		// Type filter
		if (type) {
			query.type = type;
		}

		// Build sort object
		const sortObj = {};
		sortObj[sort] = order === "desc" ? -1 : 1;

		// Execute query with pagination
		const skip = (page - 1) * limit;
		const products = await Product.find(query)
			.sort(sortObj)
			.skip(skip)
			.limit(limit)
			.lean();

		const total = await Product.countDocuments(query);
		const totalPages = Math.ceil(total / limit);

		// Transform products for frontend
		const transformedProducts = products.map((product) => ({
			id: product._id.toString(),
			name: product.title,
			description: product.description,
			longDescription: product.longDescription,
                        price: product.price,
                        originalPrice: product.mrp,
                        mainImageLink: product.mainImageLink,
                        discountPercentage:
                                product.mrp && product.mrp > product.price
                                        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                                        : 0,
                        image:
                                product.mainImageLink ||
                                product.images?.[0] ||
                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755848946/ladwapartnersfallback_s5zjgs.png",
                        images: product.images || [],
                        category: product.category,
			inStock: product.inStock,
			stocks: product.stocks,
			status: product.status,
			type: product.type,
			features: product.features || [],
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		}));

		return Response.json({
			success: true,
			products: transformedProducts,
			pagination: {
				currentPage: page,
				totalPages,
				totalProducts: total,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
				limit,
			},
		});
	} catch (error) {
		console.error("Products fetch error:", error);
		return Response.json(
			{ success: false, message: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
