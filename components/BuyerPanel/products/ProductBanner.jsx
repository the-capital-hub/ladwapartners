"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FireExtinguisherImg from "@/public/images/products/productBanner/FireExtinguisher.png";
import SafetyCombo from "@/public/images/products/productBanner/SafetyCombo.png";
import YellowCap from "@/public/images/products/productBanner/YellowCap.png";

const ProductBanner = () => {
	const banners = [
		{
			id: 1,
			title: "LADWA Median Marker - Triangle",
			subtitle: "#1 Ladwa Products",
			description:
				"Along with that while user enter bulk products to the cart.",
			buttonText: "Shop Now",
			bgColor: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600",
			textColor: "text-white",
			buttonColor: "bg-white text-orange-600 hover:bg-gray-100",
			image: SafetyCombo,
			imageAlt: "Safety equipment including helmet, gloves and tools",
		},
		{
			id: 2,
			title: "Fire Safety - Your first line defence",
			subtitle: "#1 Ladwa Products",
			description: "",
			buttonText: "Shop Now",
			bgColor: "bg-gradient-to-br from-pink-200 to-pink-300",
			textColor: "text-gray-800",
			buttonColor: "bg-red-500 text-white hover:bg-red-600",
			image: FireExtinguisherImg,
			imageAlt: "Fire extinguisher",
			compact: true,
		},
		{
			id: 3,
			title: "Industrial Safety",
			subtitle: "#1 Ladwa Products",
			description: "",
			buttonText: "Shop Now",
			bgColor: "bg-gradient-to-br from-yellow-200 to-yellow-300",
			textColor: "text-gray-800",
			buttonColor: "bg-yellow-500 text-white hover:bg-yellow-600",
			image: YellowCap,
			imageAlt: "Yellow safety helmet",
			compact: true,
		},
	];

	const MainBanner = ({ banner }) => (
		<div
			className={`${banner.bgColor} ${banner.textColor} rounded-2xl p-8 overflow-hidden relative h-full`}
		>
			<div className="flex flex-col lg:flex-row items-center justify-between h-full">
				<div className="flex-1 space-y-6 z-10 relative">
					<div>
						<p className="text-sm font-medium opacity-90 mb-2">
							{banner.subtitle}
						</p>
						<h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
							{banner.title}
						</h1>
						{banner.description && (
							<p className="text-lg opacity-80 max-w-md">
								{banner.description}
							</p>
						)}
					</div>

					<div>
						<Button
							className={`${banner.buttonColor} px-8 py-3 rounded-lg font-semibold transition-colors duration-200`}
							size="lg"
						>
							{banner.buttonText}
						</Button>
					</div>
				</div>

				<div className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0">
					<div className="relative w-80 h-64 flex items-center justify-center">
						<Image
							src={banner.image}
							alt={banner.imageAlt}
							fill
							className="object-contain"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							// priority
						/>

						{/* Static decorative elements */}
						<div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full z-10" />
						<div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/15 rounded-full z-10" />
					</div>
				</div>
			</div>
		</div>
	);

	const CompactBanner = ({ banner }) => (
		<div
			className={`${banner.bgColor} ${banner.textColor} rounded-2xl p-6 overflow-hidden relative`}
		>
			<div className="flex justify-between">
				<div className="space-y-4 z-10 relative flex-1">
					<div>
						<p className="text-xs font-medium opacity-80">{banner.subtitle}</p>
						<h2 className="text-xl lg:text-2xl font-bold leading-tight mt-2">
							{banner.title.toUpperCase()}
						</h2>
					</div>

					<div>
						<Button
							className={`${banner.buttonColor} px-6 py-2 rounded-lg font-semibold text-sm transition-colors duration-200`}
						>
							{banner.buttonText}
						</Button>
					</div>
				</div>

				<div className="w-32 h-auto flex items-center justify-center">
					<div className="relative w-24 h-20 lg:w-32 lg:h-28 flex items-center justify-center">
						<Image
							src={banner.image}
							alt={banner.imageAlt}
							fill
							className="object-contain"
							sizes="(max-width: 1024px) 96px, 128px"
							// priority
						/>

						{/* Static decoration */}
						<div className="absolute -top-2 -right-2 w-4 h-4 bg-white/25 rounded-full z-10" />
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="py-4 px-8 space-y-6">
			{/* Main Banner */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Large Banner */}
				<div className="lg:col-span-2 flex-1">
					<MainBanner banner={banners[0]} />
				</div>

				{/* Compact Banners */}
				<div className="space-y-6 flex-1">
					{banners.slice(1).map((banner) => (
						<CompactBanner key={banner.id} banner={banner} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductBanner;
