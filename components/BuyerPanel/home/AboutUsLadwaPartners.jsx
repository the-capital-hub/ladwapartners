"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import poleimg from "@/public/images/home/road.png";
import cone from "@/public/images/home/cone.png";
import AboutUs from "@/public/images/home/AboutUs.png";

import { Kanit, Outfit } from "next/font/google";

const kan = Kanit({
	weight: ["200", "400", "600"],
	variable: "--font-kanit",
	subsets: ["latin"],
});

const outfit = Outfit({
	variable: "--font-outift",
	subsets: ["latin"],
});

const AboutUsLadwaPartners = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.8,
				staggerChildren: 0.2,
			},
		},
	};

	const leftImageVariants = {
		hidden: { opacity: 0, x: -10 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	};

	const rightContentVariants = {
		hidden: { opacity: 0, x: 10 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	};

	const listItemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	const coneImageVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const buttonVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
		hover: {
			scale: 1.05,
			transition: {
				duration: 0.2,
			},
		},
		tap: {
			scale: 0.95,
		},
	};

	return (
		<motion.div
			id="about-us"
			className="bg-gray-50 py-10 px-4"
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
		>
			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
					{/* Left Image Section */}
					<motion.div
						className="w-full h-full relative order-2 lg:order-1"
						variants={leftImageVariants}
					>
						<Image
							src={AboutUs.src}
							alt="Road Ends Sign with Traffic Pole"
							width={500}
							height={300}
							className="w-full h-full rounded-2xl shadow-lg object-cover"
						/>
						{/* Floating Cone Image */}
						{/* <div className="relative">
							<motion.div
								className="rounded-2xl absolute -bottom-[15%] right-8 md:bottom-[18%] md:-right-7 w-40 h-40 md:w-32 md:h-32 lg:w-40 lg:h-40"
								variants={coneImageVariants}
								whileHover={{
									rotate: [0, 10, -10, 0],
									transition: { duration: 0.5 },
								}}
							>
								<Image
									src={cone}
									alt="Traffic Cone"
									width={250}
									height={160}
									className="w-full h-full rounded-3xl object-contain drop-shadow-lg"
								/>
							</motion.div>
						</div> */}
					</motion.div>

					{/* Right Content Section */}
					<motion.div
						className="space-y-4 order-1 lg:order-2"
						variants={rightContentVariants}
					>
						{/* Header */}
						<div className="space-y-4">
							{/* <motion.p
								className="text-gray-600 font-medium text-lg"
								variants={listItemVariants}
							>
								About Us
							</motion.p> */}
							<motion.h1
								className={`${kan.className} text-2xl md:text-3xl lg:text-4xl font-bold text-[#16213E] leading-10`}
								variants={listItemVariants}
							>
								ABOUT LADWA PARTNERS
							</motion.h1>
						</div>

						{/* Description */}
						<motion.p
							className={`${outfit.className} text-[#16213E] text-lg leading-relaxed`}
							variants={listItemVariants}
						>
							Ladwa Safety Inc is a leading manufacturer, exporter, and supplier
							based in Bangalore, Karnataka, specializing in Safety Equipment,
							Traffic Safety Equipment, Security Equipment, Barricades, and
							Retro-reflective signage. The company focuses on meeting the
							Occupational Safety, Traffic Management, Health, and Environmental
							needs of its customers by providing customized and compliant
							solutions.
						</motion.p>

						<motion.p
							className={`${outfit.className} text-[#16213E] text-lg leading-relaxed`}
							variants={listItemVariants}
						>
							With a customer-oriented and quality-driven approach, Ladwa Safety
							Inc has built a strong reputation and a diverse clientele base,
							including General Industry, Software & Call Centre Companies,
							Health Care, Utilities, and Government Organizations.
						</motion.p>

						{/* Feature List */}
						{/* <motion.div className="space-y-4 ml-8" variants={listItemVariants}>
							{[
								"Titan 4 Pcs Traffic Safety Cones are 750mm tall and highly visible.",
								"Equipped with reflective strips for enhanced visibility at night.",
								"Ideal for traffic management and safety in various environments.",
								"Durable design ensures long-lasting use in all weather conditions.",
							].map((feature, index) => (
								<motion.div
									key={index}
									className={`${outfit.className} flex items-start space-x-3`}
									variants={listItemVariants}
									whileHover={{ x: 10, transition: { duration: 0.2 } }}
								>
									<div className="flex-shrink-0 w-2 h-2 bg-[#16213E] rounded-full mt-3"></div>
									<p className="text-[#16213E] text-base leading-8">
										{feature}
									</p>
								</motion.div>
							))}
						</motion.div> */}

						{/* Call to Action Button */}
						<motion.div
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
							className="w-fit"
						>
							<button className="bg-[#FFB82D] hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform">
								Explore More
							</button>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default AboutUsLadwaPartners;
