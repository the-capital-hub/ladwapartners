"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
	ShieldCheck,
	Signpost,
	HardHat,
	Flame,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import {
	FireSafety,
	IndustrialSafety,
	RoadSafety,
	RoadSign,
} from "@/public/images/home/FeatredCategories/index.js";
import { motion } from "framer-motion";
import ProductCard from "@/components/BuyerPanel/products/ProductCard.jsx";
import { useProductStore } from "@/store/productStore.js";

export default function FeaturedCategories() {
	const {
		fetchFeaturedProductsForHome,
		getFeaturedProductsForHome,
		featuredHomePagination,
		setFeaturedHomePage,
		isLoadingFeaturedHome,
		error,
	} = useProductStore();

	const categories = [
		{ name: "Road Safety", icon: RoadSafety.src, slug: "road-safety" },
		{ name: "Road Sign", icon: RoadSign.src, slug: "signage" },
		{
			name: "Industrial Safety",
			icon: IndustrialSafety.src,
			slug: "industrial-safety",
		},
		{ name: "Fire Safety", icon: FireSafety.src, slug: "fire-safety" },
	];

	const [selectedCategory, setSelectedCategory] = useState(null);
	const featuredProducts = getFeaturedProductsForHome();

	// Fetch products when category changes
	useEffect(() => {
		fetchFeaturedProductsForHome(selectedCategory, 1);
	}, [selectedCategory, fetchFeaturedProductsForHome]);

	const handleCategorySelect = (categorySlug) => {
		setSelectedCategory(categorySlug);
	};

	const handlePreviousPage = () => {
		if (featuredHomePagination.currentPage > 1) {
			setFeaturedHomePage(featuredHomePagination.currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (
			featuredHomePagination.currentPage < featuredHomePagination.totalPages
		) {
			setFeaturedHomePage(featuredHomePagination.currentPage + 1);
		}
	};

	const handlePageSelect = (pageNumber) => {
		setFeaturedHomePage(pageNumber);
	};

	return (
		<section className="py-8 md:py-16 bg-gray-50">
			<div className="px-10 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-3xl mx-auto"
				>
					<p className="text-3xl md:text-4xl mb-8 lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight whitespace-nowrap">
						Featured Categories
					</p>
					<p className="text-gray-700 mb-8">
						Ladwa Partner is an online dealer portal by Ladwa Solutions Inc.
						Ladwa Solutions Inc is a pioneer in the manufacture, supply, and
						export of Traffic Safety Equipment, Industrial Safety Equipment,
						Security Equipment, Barrication & Retro reflective signages.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ staggerChildren: 0.1 }}
					className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
				>
					{categories.map((cat, index) => {
						const Icon = cat.icon;
						const isActive = selectedCategory === cat.slug;
						return (
							<motion.div
								key={cat.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								onClick={() => handleCategorySelect(cat.slug)}
								className={`p-4 bg-yellow-500 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center cursor-pointer ${
									isActive ? "ring-2 ring-yellow-600 ring-offset-2" : ""
								}`}
							>
								<Image
									src={Icon}
									alt={cat.name}
									width={100}
									height={100}
									className="w-20 h-20 fill-yellow-500 text-yellow-500 mb-4"
								/>
								<h3 className="font-semibold">{cat.name}</h3>
							</motion.div>
						);
					})}
				</motion.div>

				{selectedCategory && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-8"
					>
						{isLoadingFeaturedHome ? (
							<div className="flex justify-center items-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
								<span className="ml-2 text-gray-600">Loading products...</span>
							</div>
						) : error ? (
							<div className="text-red-500 py-4">
								Error loading products: {error}
							</div>
						) : featuredProducts.length > 0 ? (
							<>
								<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-2 justify-center md:justify-start">
									{featuredProducts.map((product) => (
										<ProductCard
											product={{
												id: product.id,
												title: product.name,
												description: product.description,
												price: product.price,
												salePrice: product.price,
												images: [product.mainImageLink || product.image],
												inStock: product.inStock,
												discountPercentage: 0,
											}}
										/>
									))}
								</div>

								{/* Pagination Controls */}
								<div className="flex justify-between items-center gap-4 mt-6 px-10">
									<div className="text-sm text-gray-500">
										Showing {featuredProducts.length} of{" "}
										{featuredHomePagination.totalProducts} products
									</div>

									{featuredHomePagination.totalPages > 1 && (
										<div className="flex justify-center items-center gap-2">
											<button
												onClick={handlePreviousPage}
												disabled={featuredHomePagination.currentPage === 1}
												className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
											>
												<ChevronLeft className="w-4 h-4" />
											</button>

											<div className="flex gap-1">
												{Array.from(
													{ length: featuredHomePagination.totalPages },
													(_, i) => i + 1
												).map((pageNumber) => (
													<button
														key={pageNumber}
														onClick={() => handlePageSelect(pageNumber)}
														className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
															pageNumber === featuredHomePagination.currentPage
																? "bg-yellow-500 text-white"
																: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
														}`}
													>
														{pageNumber}
													</button>
												))}
											</div>

											<button
												onClick={handleNextPage}
												disabled={
													featuredHomePagination.currentPage ===
													featuredHomePagination.totalPages
												}
												className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
											>
												<ChevronRight className="w-4 h-4" />
											</button>
										</div>
									)}
								</div>
							</>
						) : (
							<div className="text-gray-500 py-8">
								No products found for this category.
							</div>
						)}
					</motion.div>
				)}
			</div>
		</section>
	);
}
