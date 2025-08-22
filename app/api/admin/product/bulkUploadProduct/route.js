// api/admin/product/bulkUploadProduct/route.js

import { dbConnect } from "@/lib/dbConnect";
import Product from "@/model/Product";
import cloudinary from "@/lib/cloudnary.js";

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
                                        sku,
                                        category,
                                        subCategory,
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

                                if (
                                        !title ||
                                        !category ||
                                        !sku ||
                                        Number.isNaN(parsedPrice) ||
                                        Number.isNaN(parsedMrp)
                                ) {
                                        results.failed.push({
                                                data: productData,
                                                error: "Missing or invalid required fields",
                                        });
                                        continue;
                                }

                                let featureImageUrl = "";
                                if (featureImage) {
                                        try {
                                                const uploaded = await cloudinary.uploader.upload(featureImage, {
                                                        folder: "products",
                                                });
                                                featureImageUrl = uploaded.secure_url;
                                        } catch (err) {
                                                console.error("Feature image upload failed:", err);
                                        }
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
                                        category,
                                        subCategory,
                                        sku,
                                        price: parsedPrice,
                                        mrp: parsedMrp,
                                        featureImage: featureImageUrl,
                                        mainImageLink,
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
                                        images: featureImageUrl ? [featureImageUrl] : [],
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
