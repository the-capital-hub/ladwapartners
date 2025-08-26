import { dbConnect } from "@/lib/dbConnect";
import Product from "@/model/Product";
import Category from "@/model/Category";
import cloudinary from "@/lib/cloudnary.js";

export async function PUT(request) {
	await dbConnect();

	try {
		const formData = await request.formData();

		// Get productId from formData
		const productId = formData.get("productId");

		if (!productId) {
			return Response.json(
				{ success: false, message: "Product ID is required" },
				{ status: 400 }
			);
		}

		// Find product
		const product = await Product.findById(productId);

		if (!product) {
			return Response.json(
				{ success: false, message: "Product not found" },
				{ status: 404 }
			);
		}

		// Extract product data from formData
		const title = formData.get("title");
		const description = formData.get("description");
                const longDescription = formData.get("longDescription");
                const category = formData.get("category");
                const subCategory = formData.get("subCategory");
                const mrp = formData.get("mrp")
                        ? parseFloat(formData.get("mrp"))
                        : undefined;
                const mainImageLink = formData.get("mainImageLink");
                const lengthVal = formData.get("length");
                const widthVal = formData.get("width");
                const heightVal = formData.get("height");
                const weightVal = formData.get("weight");
                const colour = formData.get("colour");
                const material = formData.get("material");
                const brand = formData.get("brand");
                const size = formData.get("size");
                const price = parseFloat(formData.get("price"));
                const salePrice = formData.get("salePrice")
                        ? parseFloat(formData.get("salePrice"))
                        : 0;
                const stocks = parseInt(formData.get("stocks"));
                const discount = formData.get("discount")
                        ? parseFloat(formData.get("discount"))
                        : 0;
                const type = formData.get("type");
                const published = formData.get("published") === "true";

                // Ensure category exists in master table
                if (category) {
                        let existingCategory = await Category.findOne({ slug: category });
                        if (!existingCategory) {
                                const name = category.replace(/-/g, " ");
                                existingCategory = await Category.create({
                                        name,
                                        description: `${name} category`,
                                        subCategories: subCategory ? [subCategory] : [],
                                });
                        } else if (subCategory) {
                                await Category.updateOne(
                                        { slug: category },
                                        { $addToSet: { subCategories: subCategory } }
                                );
                        }
                }

                // Parse features
                let features = [];
		try {
			const featuresString = formData.get("features");
			if (featuresString) {
				features = JSON.parse(featuresString);
			}
		} catch (error) {
			console.error("Error parsing features:", error);
			features = [];
		}

                // Handle images
                let imageUrls = [];

		// Get existing images that should be kept
		const existingImages = formData.getAll("existingImages");
		imageUrls = [...existingImages];

		// Get new image files to upload
		const newImageFiles = formData.getAll("images");

		if (newImageFiles.length > 0) {
			try {
				// Upload new images to Cloudinary
				const uploadPromises = newImageFiles.map(async (file) => {
					try {
						// Check if file is a Blob/File object
						if (!(file instanceof Blob)) {
							throw new Error("Invalid file format");
						}

						const buffer = Buffer.from(await file.arrayBuffer());

						return new Promise((resolve, reject) => {
							cloudinary.uploader
								.upload_stream(
									{
										resource_type: "image",
										folder: "safety_products_images",
										quality: "auto",
										format: "webp",
									},
									(error, result) => {
										if (error) {
											console.error("Cloudinary upload error:", error);
											reject(error);
										} else {
											resolve(result.secure_url);
										}
									}
								)
								.end(buffer);
						});
					} catch (error) {
						console.error("File processing error:", error);
						throw error;
					}
				});

				const newImageUrls = await Promise.all(uploadPromises);
				imageUrls = [...imageUrls, ...newImageUrls];

				console.log("New images uploaded successfully:", newImageUrls.length);
			} catch (error) {
				console.error("Image upload error:", error);
				return Response.json(
					{
						success: false,
						message: "Failed to upload images",
					},
					{ status: 500 }
				);
			}
		}

                // Update product fields
                product.title = title;
                product.description = description;
                product.longDescription = longDescription || description;
                product.category = category;
                product.subCategory = subCategory;
                if (mrp !== undefined && !Number.isNaN(mrp)) product.mrp = mrp;
                product.mainImageLink = mainImageLink;
                const parsedLength = lengthVal ? parseFloat(lengthVal) : undefined;
                const parsedWidth = widthVal ? parseFloat(widthVal) : undefined;
                const parsedHeight = heightVal ? parseFloat(heightVal) : undefined;
                const parsedWeight = weightVal ? parseFloat(weightVal) : undefined;
                if (!Number.isNaN(parsedLength)) product.length = parsedLength;
                if (!Number.isNaN(parsedWidth)) product.width = parsedWidth;
                if (!Number.isNaN(parsedHeight)) product.height = parsedHeight;
                if (!Number.isNaN(parsedWeight)) product.weight = parsedWeight;
                product.colour = colour;
                product.material = material;
                product.brand = brand;
                product.size = size;
                product.price = price;
                product.salePrice = salePrice;
                product.stocks = stocks;
		product.discount = discount;
		product.type = type;
		product.published = published;
		product.features = features;
		product.images = imageUrls;

		await product.save();

		console.log("Product updated successfully:", product._id);

		return Response.json({
			success: true,
			message: "Product updated successfully",
			product,
		});
	} catch (error) {
		console.error("Update product error:", error);
		return Response.json(
			{ success: false, message: "Failed to update product" },
			{ status: 500 }
		);
	}
}
