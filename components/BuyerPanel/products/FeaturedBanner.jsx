"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore.js";
import { useProductStore } from "@/store/productStore.js";

export default function FeaturedBanner() {
	const { addItem } = useCartStore();
	const featuredProducts = useProductStore((state) =>
		state.getFeaturedProducts()
	);
	const [current, setCurrent] = useState(0);
	const router = useRouter();

	if (!featuredProducts || featuredProducts.length === 0) {
		return null;
	}

	const product = featuredProducts[current];

	const handleAddToCart = () => {
		addItem(product, 1);
	};

	const handleRedirect = () => {
		const id = product.id || product._id;
		router.push(`/products/${id}`);
	};

	const prev = () => {
		setCurrent((idx) => (idx === 0 ? featuredProducts.length - 1 : idx - 1));
	};

	const next = () => {
		setCurrent((idx) => (idx === featuredProducts.length - 1 ? 0 : idx + 1));
	};

	return (
		<motion.section
			className="relative rounded-xl bg-white overflow-hidden"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="grid grid-cols-1 lg:grid-cols-2 items-center">
				<div className="p-8 lg:p-12">
					<div className="text-sm font-medium text-red-600 mb-2">
						Featured Product
					</div>
					<h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
						{product.name}
					</h2>
					<p className="text-gray-600 mb-6 max-w-md line-clamp-6">
						{product.description}
					</p>
					<div className="flex items-center gap-4">
						<Button
							className="bg-black text-white hover:bg-gray-800"
							onClick={handleAddToCart}
						>
							BUY NOW <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
						<Button variant="outline" onClick={handleRedirect}>
							VIEW PRODUCT
						</Button>
					</div>
				</div>
				<div
					className="relative h-64 lg:h-96 cursor-pointer"
					onClick={handleRedirect}
				>
                                        <Image
                                                src={product.mainImageLink || product.image}
                                                alt={product.name}
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-contain p-8"
                                        />
                               </div>
                       </div>
			{featuredProducts.length > 1 && (
				<div className="absolute inset-y-0 left-0 flex items-center pl-4">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full h-8 w-8 bg-white/70"
						onClick={prev}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
				</div>
			)}
			{featuredProducts.length > 1 && (
				<div className="absolute inset-y-0 right-0 flex items-center pr-4">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full h-8 w-8 bg-white/70"
						onClick={next}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</motion.section>
	);
}
