"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ShoppingCart,
	Heart,
	Eye,
	ArrowRight,
	Star,
	Minus,
	Plus,
	HeartPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useIsAuthenticated, useIsGstVerified } from "@/store/authStore";
import Image from "next/image";
import { getDirectGoogleDriveImageUrl } from "@/lib/utils";

export default function ProductCard({ product, viewMode = "grid" }) {
	const router = useRouter();
	const { addItem, isLoading } = useCartStore();
	const isAuthenticated = useIsAuthenticated();
	const isGstVerified = useIsGstVerified();
	const [quantity, setQuantity] = useState(1);

        const fallbackImage =
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755848946/ladwapartnersfallback_s5zjgs.png";
        const imageSrc = getDirectGoogleDriveImageUrl(
                product.mainImageLink ||
                        product.images?.[0] ||
                        product.image ||
                        fallbackImage
        );

	const changeQuantity = (e, delta) => {
		e.stopPropagation();
		setQuantity((q) => Math.max(1, q + delta));
	};

	const handleViewProduct = () => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}
		router.push(`/products/${product.id || product._id}`);
	};

	const handleAddToCart = async (e) => {
		e.stopPropagation();

		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		await addItem(
			{
				id: product.id || product._id,
				name: product.title,
				description: product.description,
				price: product.price,
				originalPrice: product.originalPrice,
                                image: getDirectGoogleDriveImageUrl(
                                        product.mainImageLink ||
                                                product.images?.[0] ||
                                                product.image
                                ),
				inStock: product.inStock,
			},
			quantity
		);
	};

	const handleBuyNow = async (e) => {
		e.stopPropagation();

		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		router.push(
			`/checkout?buyNow=true&id=${product.id || product._id}&qty=${quantity}`
		);
	};

	/* ---------------- LIST VIEW ---------------- */
	if (viewMode === "list") {
		return (
			<Card
				onClick={handleViewProduct}
				className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
			>
				<CardContent className="p-6">
					<div className="flex flex-col sm:flex-row gap-6">
						{/* Image */}
						<div className="relative w-full sm:w-48 h-48 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
							<Image
								src={imageSrc}
								alt={product?.title || "product image"}
								fill
								className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
								onClick={handleViewProduct}
							/>
							{product.discountPercentage > 0 && (
								<Badge className="absolute top-2 left-2 bg-red-500 text-white">
									{product.discountPercentage}% OFF
								</Badge>
							)}
							{product.type === "featured" && (
								<Badge className="absolute top-2 right-2 bg-blue-500 text-white">
									Featured
								</Badge>
							)}
						</div>

						{/* Content */}
						<div className="flex-1 space-y-4">
							<div onClick={handleViewProduct}>
								<h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
									{product.title}
								</h3>
								<p className="text-gray-600 mt-2 line-clamp-2">
									{product.description}
								</p>
								<div className="flex items-center gap-2 mt-2">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-4 w-4 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<span className="text-sm text-gray-500">(4.5)</span>
								</div>
							</div>

							{/* Price + Stock */}
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									{!isAuthenticated ? (
										<p className="text-red-600 font-medium">
											Please login to see price
										</p>
									) : !isGstVerified ? (
										<p className="text-red-600 font-medium">
											Please verify your GST number
										</p>
									) : (
										<div className="flex items-center gap-2">
											<p className="text-2xl font-bold">
												₹{product.price.toLocaleString()}
											</p>
											{product.originalPrice > product.price && (
												<p className="text-lg text-gray-500 line-through">
													₹{product.originalPrice.toLocaleString()}
												</p>
											)}
										</div>
									)}
									<p
										className={`text-sm ${
											product.inStock ? "text-green-600" : "text-red-600"
										}`}
									>
										{product.inStock ? "In Stock" : "Out of Stock"}
									</p>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-2 flex-wrap">
									<div className="flex items-center border rounded-full">
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={(e) => changeQuantity(e, -1)}
										>
											<Minus className="h-3 w-3" />
										</Button>
										<span className="px-2 text-sm">{quantity}</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={(e) => changeQuantity(e, 1)}
										>
											<Plus className="h-3 w-3" />
										</Button>
									</div>
									<Button
										variant="outline"
										size="icon"
										className="rounded-full bg-transparent"
										disabled={!isAuthenticated}
									>
										<Heart className="h-4 w-4" />
									</Button>
									<Button
										onClick={handleAddToCart}
										disabled={!product.inStock || isLoading || !isAuthenticated}
										variant="outline"
										className="rounded-full bg-transparent"
									>
										<ShoppingCart className="h-4 w-4 mr-2" />
										Add to Cart
									</Button>
									<Button
										onClick={handleBuyNow}
										disabled={!product.inStock || isLoading}
										className="bg-black text-white hover:bg-gray-800 rounded-full"
									>
										Buy Now
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	/* ---------------- GRID VIEW ---------------- */
	return (
		<motion.div
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
			className="h-full"
		>
			<Card
				onClick={handleViewProduct}
				className="hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
			>
				<CardContent className="p-0 flex-1 flex flex-col">
					{/* Image */}
					<div className="relative m-4 h-64 bg-gray-100 rounded-xl overflow-hidden">
						<Image
							src={imageSrc}
							alt={product.title || "Product Image"}
							fill
							className="object-contain group-hover:scale-110 transition-transform duration-300 rounded-xl"
							onClick={handleViewProduct}
						/>

						{/* Badges */}
						<div className="absolute top-2 left-2 flex flex-col gap-1">
							{product.discountPercentage > 0 && (
								<Badge className="bg-red-500 text-white">
									{product.discountPercentage}% OFF
								</Badge>
							)}
							{product.type === "featured" && (
								<Badge className="bg-blue-500 text-white">Featured</Badge>
							)}
						</div>

						{/* Quick view */}
						<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
							<Button
								variant="secondary"
								size="icon"
								className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
								onClick={handleViewProduct}
							>
								<Eye className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 flex-1 flex flex-col">
						<div className="flex-1" onClick={handleViewProduct}>
							<h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
								{product.title}
							</h3>
							<p className="text-gray-600 text-sm mb-3 font-normal line-clamp-2">
								{product.description}
							</p>

							{/* Rating */}
							{/* <div className="flex items-center gap-2 mb-3">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className="h-3 w-3 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
								<span className="text-xs text-gray-500">(4.5)</span>
							</div> */}
						</div>

						{/* Quantity Update */}
						<div className="flex items-center gap-4 flex-wrap border-b border-gray-400 pb-4">
							<h2>Update Qty</h2>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 border border-black rounded-full"
									onClick={(e) => changeQuantity(e, -1)}
								>
									<Minus className="h-3 w-3" />
								</Button>
								<span className="px-2 font-bold text-sm">{quantity}</span>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 border border-black rounded-full"
									onClick={(e) => changeQuantity(e, 1)}
								>
									<Plus className="h-3 w-3" />
								</Button>
							</div>
						</div>

						{/* Price + Stock - Fixed duplicate section */}
						<div className="space-y-2 my-4">
							{!isAuthenticated ? (
								<p className="text-red-600 font-medium">
									Please login to see price
								</p>
							) : !isGstVerified ? (
								<p className="text-red-600 font-medium">
									Please verify your GST number
								</p>
							) : (
								<div className="flex items-center gap-3">
									<p className="text-xl font-bold">
										₹{product.price.toLocaleString()}
									</p>
									{product.originalPrice > product.price && (
										<p className="text-lg text-gray-500 line-through">
											₹{product.originalPrice.toLocaleString()}
										</p>
									)}
									{product.originalPrice > product.price && (
										<div className="text-sm font-semibold text-black border border-black px-2 py-1 rounded-sm">
											{product.discountPercentage.toLocaleString()}% OFF
										</div>
									)}
								</div>
							)}

							{/* Stock */}
							<p
								className={`text-xs ${
									product.inStock ? "text-green-600" : "text-red-600"
								}`}
							>
								{product.inStock ? "In Stock" : "Out of Stock"}
							</p>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-between gap-2 flex-wrap">
							<div className="w-full flex gap-2">
								<Button
									onClick={handleBuyNow}
									disabled={!product.inStock || isLoading || !isAuthenticated}
									className="bg-blue-600 text-white hover:bg-blue-800 rounded-full flex-shrink-0 whitespace-nowrap flex-1"
									size="sm"
								>
									Buy Now
									<ArrowRight className="ml-1 h-3 w-3 -rotate-45" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="rounded-full text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800 bg-transparent"
									disabled={!isAuthenticated}
								>
									<HeartPlus className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={handleAddToCart}
									disabled={!product.inStock || isLoading || !isAuthenticated}
									className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
								>
									<ShoppingCart className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
