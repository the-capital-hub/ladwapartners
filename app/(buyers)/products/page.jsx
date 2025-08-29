"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/productStore.js";
import ProductGrid from "@/components/BuyerPanel/products/ProductGrid.jsx";
// import FeaturedBanner from "@/components/BuyerPanel/products/FeaturedBanner.jsx";
import ProductBanner from "@/components/BuyerPanel/products/ProductBanner.jsx";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
	const searchParams = useSearchParams();

        const {
                error,
                fetchProducts,
                setCurrentCategory,
                setSearchQuery,
                setFilters,
        } = useProductStore();

        // Handle URL parameters
        useEffect(() => {
                const category = searchParams.get("category");
                const subCategory = searchParams.get("subCategory");
                const search = searchParams.get("search");

                if (search) {
                        // Searching triggers its own fetch inside setSearchQuery
                        setSearchQuery(search);
                } else {
                        // Apply category filters first, then update store and fetch
                        if (category && !subCategory) {
                                setFilters({ categories: [category] });
                        } else {
                                setFilters({ categories: [] });
                        }
                        setCurrentCategory(category || "all", subCategory || "");
                        fetchProducts();
                }
        }, [
                searchParams,
                fetchProducts,
                setCurrentCategory,
                setSearchQuery,
                setFilters,
        ]);

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
			<ProductBanner />
			<div className="container mx-auto p-8">
				<ProductGrid />
			</div>
		</div>
	);
}
