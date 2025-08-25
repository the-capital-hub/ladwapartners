// app/api/products/filters/route.js

import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Category from "@/model/Category.js";

// Commented out predefined categories - now fetching from database
// const categories = [
// 	"personal-safety",
// 	"road-safety",
// 	"signage",
// 	"industrial-safety",
// 	"queue-management",
// 	"fire-safety",
// 	"first-aid",
// 	"water-safety",
// 	"emergency-kit",
// ];

export async function GET() {
	await dbConnect();

	try {
		// Fetch categories from database
		const categoriesFromDB = await Category.find({ published: true })
			.select("name slug productCount")
			.sort({ sortOrder: 1, name: 1 });

		// Get price range
		const priceStats = await Product.aggregate([
			{ $match: { published: true } },
			{
				$group: {
					_id: null,
					minPrice: {
						$min: {
							$cond: [{ $gt: ["$salePrice", 0] }, "$salePrice", "$price"],
						},
					},
					maxPrice: { $max: "$price" },
				},
			},
		]);

		const { minPrice = 0, maxPrice = 10000 } = priceStats[0] || {};

		// Get category counts from products (real-time count)
		const categoryCounts = await Product.aggregate([
			{ $match: { published: true } },
			{ $group: { _id: "$category", count: { $sum: 1 } } },
		]);

		const categoryMap = categoryCounts.reduce((acc, item) => {
			acc[item._id] = item.count;
			return acc;
		}, {});

		// Get discount range
		const discountStats = await Product.aggregate([
			{
				$match: {
					published: true,
					$or: [{ discount: { $gt: 0 } }, { salePrice: { $gt: 0 } }],
				},
			},
			{
				$addFields: {
					calculatedDiscount: {
						$cond: [
							{ $gt: ["$salePrice", 0] },
							{
								$multiply: [
									{
										$divide: [
											{ $subtract: ["$price", "$salePrice"] },
											"$price",
										],
									},
									100,
								],
							},
							"$discount",
						],
					},
				},
			},
			{
				$group: {
					_id: null,
					minDiscount: { $min: "$calculatedDiscount" },
					maxDiscount: { $max: "$calculatedDiscount" },
				},
			},
		]);

		const { minDiscount = 0, maxDiscount = 100 } = discountStats[0] || {};

		// Get available types
		const types = await Product.distinct("type", { published: true });

		// Check stock availability
		const stockStats = await Product.aggregate([
			{ $match: { published: true } },
			{
				$group: {
					_id: null,
					inStockCount: { $sum: { $cond: ["$inStock", 1, 0] } },
					outOfStockCount: { $sum: { $cond: ["$inStock", 0, 1] } },
				},
			},
		]);

		const { inStockCount = 0, outOfStockCount = 0 } = stockStats[0] || {};

		// Map database categories to the expected format
		const categoriesWithCounts = categoriesFromDB.map((category) => ({
			id: category.slug || category.name.toLowerCase().replace(/\s+/g, "-"),
			name: category.name,
			label: category.name,
			count:
				categoryMap[category.slug] ||
				categoryMap[category.name] ||
				category.productCount ||
				0,
			slug: category.slug,
		}));

		return Response.json({
			success: true,
			filters: {
				priceRange: {
					min: Math.floor(minPrice),
					max: Math.ceil(maxPrice),
				},
				categories: categoriesWithCounts,
				discount: {
					min: Math.floor(minDiscount),
					max: Math.ceil(maxDiscount),
				},
				stock: {
					inStock: inStockCount,
					outOfStock: outOfStockCount,
					total: inStockCount + outOfStockCount,
				},
				types: types.map((type) => ({
					id: type,
					label: type
						.split("-")
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(" "),
				})),
			},
		});
	} catch (error) {
		console.error("Filters fetch error:", error);
		return Response.json(
			{ success: false, message: "Failed to fetch filters" },
			{ status: 500 }
		);
	}
}
