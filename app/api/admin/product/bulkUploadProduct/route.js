// api/admin/product/bulkUploadProduct/route.js

import { dbConnect } from "@/lib/dbConnect";
import Product from "@/model/Product";
import Category from "@/model/Category";
import { getGoogleDriveFolderImageUrls } from "@/lib/utils";

export async function POST(request) {
	await dbConnect();

	try {
		const { products } = await request.json();

		if (!Array.isArray(products) || products.length === 0) {
			return Response.json(
				{ success: false, message: "Invalid products data" },
				{ status: 400 }
			);
		}

		const results = {
			success: [],
			failed: [],
		};

                for (const productData of products) {
                        try {
                                const {
                                        title,
                                        description,
                                        price,
                                        mrp,
                                        category,
                                        subCategory,
                                        hsnCode,
                                        featureImage,
                                        mainImageLink,
                                        length,
                                        width,
                                        height,
                                        weight,
                                        colour,
                                        material,
                                        brand,
                                        size,
                                } = productData;

                                const parsedPrice = Number.parseFloat(price);
                                const parsedMrp = Number.parseFloat(mrp);


                                const missingFields = [];
                                if (!title) missingFields.push("title");
                                if (!category) missingFields.push("category");
                                if (Number.isNaN(parsedPrice)) missingFields.push("price");
                                if (Number.isNaN(parsedMrp)) missingFields.push("mrp");

                                if (missingFields.length > 0) {
                                        results.failed.push({
                                                data: productData,
                                                error: `Missing or invalid required fields: ${missingFields.join(", ")}`,

                                        });
                                        continue;
                                }

                                // Ensure category and subcategory exist in master table
                                if (category) {
                                        const categorySlug = category
                                                .toLowerCase()
                                                .replace(/[^a-zA-Z0-9]/g, "-")
                                                .replace(/-+/g, "-")
                                                .replace(/^-|-$/g, "");

                                        let existingCategory = await Category.findOne({ slug: categorySlug });

                                        if (existingCategory) {
                                                // Track duplicate category product
                                                results.duplicates = results.duplicates || [];
                                                results.duplicates.push({
                                                        title,
                                                        category: existingCategory.name,
                                                });

                                                if (subCategory) {
                                                        await Category.updateOne(
                                                                { _id: existingCategory._id },
                                                                { $addToSet: { subCategories: subCategory } }
                                                        );
                                                }
                                        } else {
                                                const name = category.trim();
                                                existingCategory = await Category.create({
                                                        name,
                                                        description: `${name} category`,
                                                        subCategories: subCategory
                                                                ? [subCategory]
                                                                : [],
                                                });
                                        }

                                        productData.category = existingCategory.slug;
                                }

                                const finalCategory = productData.category || category;

                                let images = Array.isArray(productData.images)
                                        ? productData.images
                                        : [];
                                if (!images.length && productData.imageFolder) {
                                        images = await getGoogleDriveFolderImageUrls(
                                                productData.imageFolder
                                        );
                                }

                                const featureImageUrl =
                                        mainImageLink ||
                                        featureImage ||
                                        images[0] ||
                                        "";

                                if (featureImageUrl) {
                                        images = [
                                                featureImageUrl,
                                                ...images.filter((img) => img !== featureImageUrl),
                                        ];
                                }

                                const parsedLength =
                                        length !== undefined && length !== ""
                                                ? Number.parseFloat(length)
                                                : undefined;
                                const parsedWidth =
                                        width !== undefined && width !== ""
                                                ? Number.parseFloat(width)
                                                : undefined;
                                const parsedHeight =
                                        height !== undefined && height !== ""
                                                ? Number.parseFloat(height)
                                                : undefined;
                                const parsedWeight =
                                        weight !== undefined && weight !== ""
                                                ? Number.parseFloat(weight)
                                                : undefined;

                                const product = new Product({
                                        title,
                                        description: description || "",
                                        longDescription: description || "",
                                        category: finalCategory,
                                        subCategory,
                                        price: parsedPrice,
                                        mrp: parsedMrp,
                                        featureImage: featureImageUrl,
                                        mainImageLink,
                                        hsnCode,
                                        length: Number.isNaN(parsedLength)
                                                ? undefined
                                                : parsedLength,
                                        width: Number.isNaN(parsedWidth)
                                                ? undefined
                                                : parsedWidth,
                                        height: Number.isNaN(parsedHeight)
                                                ? undefined
                                                : parsedHeight,
                                        weight: Number.isNaN(parsedWeight)
                                                ? undefined
                                                : parsedWeight,
                                        colour,
                                        material,
                                        brand,
                                        size,
                                        images,
                                        published:
                                                productData.published !== undefined ? productData.published : true,
                                        stocks: productData.stocks ? Number.parseInt(productData.stocks) : 0,
                                });

                                await product.save();
                                results.success.push(product);
                        } catch (error) {
                                results.failed.push({
                                        data: productData,
                                        error: error.message,
                                });
                        }
                }

		return Response.json({
			success: true,
			message: `Bulk upload completed. ${results.success.length} products added, ${results.failed.length} failed.`,
			results,
		});
	} catch (error) {
		console.error("Bulk upload error:", error);
		return Response.json(
			{ success: false, message: "Failed to bulk upload products" },
			{ status: 500 }
		);
	}
}
