"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/productStore.js";
// import ProductFilters from "@/components/BuyerPanel/products/ProductFilters.jsx";
import ProductGrid from "@/components/BuyerPanel/products/ProductGrid.jsx";
import FeaturedBanner from "@/components/BuyerPanel/products/FeaturedBanner.jsx";
import ProductsShowcase from "@/components/EachCategoryTopPanel/ProductShowCase";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
	const searchParams = useSearchParams();

	const { error, fetchProducts, setCurrentCategory, setSearchQuery } =
		useProductStore();

	// Handle URL parameters
	useEffect(() => {
		const category = searchParams.get("category");
		const search = searchParams.get("search");

		if (category) {
			setCurrentCategory(category);
		}

		if (search) {
			setSearchQuery(search);
		}

		fetchProducts();
	}, [searchParams, fetchProducts, setCurrentCategory, setSearchQuery]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
					<p className="text-gray-600">{error}</p>
					<button
						onClick={() => fetchProducts()}
						className="mt-4 px-4 py-2 bg-black text-white rounded"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen bg-gray-50">
			{/* Featured Banner */}
			<ProductsShowcase/>
			<FeaturedBanner />
			<div className="container mx-auto p-8">
				<ProductGrid />
			</div>
		</div>
	);
}
