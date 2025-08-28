"use client";

import { motion } from "framer-motion";
// import { Truck, Headphones, Heart, Shield } from "lucide-react";
import { Barcode, Truck, Lock, Headphones } from "lucide-react";
import { Kanit } from "next/font/google";

const kan = Kanit({
	weight: ["200", "400", "600"],
	variable: "--font-kanit",
	subsets: ["latin"],
});

export default function SupportSection() {
	const supportItems = [
		{
			icon: Barcode,
			title: "500+ Products",
			description: "Wide range of genuine and trusted products to choose from.",
		},
		{
			icon: Truck,
			title: "Free Delivery",
			description: "Enjoy free and fast delivery across India on all orders.",
		},
		{
			icon: Lock,
			title: "Secure Payments",
			description:
				"Your transactions are safe with encrypted payment gateways.",
		},
		{
			icon: Headphones,
			title: "Quality Support",
			description:
				"Call us at +91 9945234161 or email us at sales@ladwaspartner.com",
		},
	];

	return (
		<section className="py-8 md:py-8 bg-gray-50">
			{/* <div>
				<h1
					className={`${kan.className} text-[#16213E] text-4xl font-bold text-center mb-5`}
				>
					We Support
				</h1>
			</div> */}
			<div className="px-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
					{supportItems.map((item, index) => {
						const IconComponent = item.icon;
						return (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="text-center bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-shadow"
							>
								<div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
									<IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
								</div>
								<h3 className="font-bold mb-2 text-sm md:text-base">
									{item.title}
								</h3>
								<p className="text-gray-600 text-xs md:text-sm">
									{item.description}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
