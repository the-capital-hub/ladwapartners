"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import hero1 from "@/public/images/home/hero1.png";
import hero2 from "@/public/images/home/her02.png";
import hero3 from "@/public/images/home/hero3.png";
import HeroImgNew from "@/public/images/home/HeroImgNew.png";
import HeroImg1 from "@/public/images/home/HeroImg1.png";
import HeroImg2 from "@/public/images/home/HeroImg2.png";
import HeroImg3 from "@/public/images/home/HeroImg3.png";
import mobileimg from "@/public/images/home/heroimg.png";
import { Outfit } from "next/font/google";

const outfit = Outfit({
	variable: "--font-outift",
	subsets: ["latin"],
});

export default function HeroSection() {
	return (
		<section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
			<div className="absolute inset-0 pointer-events-none w-screen left-1/2 transform -translate-x-1/2 hidden md:block">
				{/* First Section - Highest */}
				<div
					className="absolute h-[90%] left-0 border-r border-white/10"
					style={{
						top: "0px",
						bottom: "80px",
						width: "33.333%",
						backgroundColor: "rgba(255, 255, 255, 0.08)",
					}}
				>
					<Image
						src={HeroImg1}
						alt="HeroImage"
						className="h-full w-full object-cover"
					/>
					{/* Black overlay */}
					<div className="absolute inset-0 bg-black/20"></div>
				</div>

				{/* Second Section - Medium height */}
				<div
					className="absolute h-[85%] border-r border-r-[50%] border-white/30"
					style={{
						top: "0px",
						bottom: "100px",
						left: "33.333%",
						width: "33.333%",
						backgroundColor: "rgba(255, 255, 255, 0.05)",
						borderRight: "1px solid rgba(255, 255, 255, 0.3)",
					}}
				>
					<Image
						src={HeroImg2}
						alt="HeroImage"
						className="h-full w-full object-cover"
					/>

					<div className="absolute inset-0 bg-black/20"></div>
					<div className="absolute bottom-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
						<span className="text-blue-600 text-xl font-bold">
							SAFETY FIRST
						</span>
					</div>
				</div>

				{/* Third Section - Smallest */}
				<div
					className="absolute h-[81%]"
					style={{
						top: "0px",
						bottom: "200px",
						left: "66.666%",
						width: "33.334%",
						backgroundColor: "rgba(255, 255, 255, 0.05)",
					}}
				>
					<Image
						src={HeroImg3}
						alt="HeroImage"
						className="h-full w-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/20"></div>
					<div className="absolute bottom-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
						<span className="text-blue-600 text-xl font-bold">
							FIRST AID KIT
						</span>
					</div>
				</div>

				<div
					style={{
						position: "absolute",
						bottom: "160px",
						left: "33.333%",
						width: "33.333%",
						height: "1px",
						backgroundColor: "rgba(255, 255, 255, 0.3)",
					}}
				></div>
				<div
					style={{
						position: "absolute",
						bottom: "185px",
						left: "66.666%",
						width: "33.334%",
						height: "1px",
						backgroundColor: "rgba(255, 255, 255, 0.3)",
					}}
				></div>
			</div>

			{/* Mobile background image */}
			<div className="absolute inset-0 md:hidden">
				<Image
					src={mobileimg}
					alt="HeroImage"
					className="h-full w-full object-cover"
				/>
				{/* Black overlay for mobile */}
				<div className="absolute inset-0 bg-black/60"></div>
			</div>

			{/* Content */}
			<div className="relative z-20 max-w-7xl w-full px-4 md:px-6 lg:px-12 grid grid-cols-1 gap-8 mx-auto">
				<div className="flex flex-col justify-center space-y-4 md:space-y-6">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className={`bg-blue-600 text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-1 rounded-full w-fit ${outfit.className}`}
						// className={`bg-white/10 text-black border border-t-[#FFB82D] text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-1 rounded-full w-fit ${outfit.className}`}
					>
						#1 Platform for Safety Products
					</motion.span>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-2xl text-blue-600 md:text-3xl lg:text-6xl font-extrabold leading-tight"
					>
						{/* DELIVERING SUPERIOR ROAD <br className="hidden md:block" />
						<span className="md:hidden">CONSTRUCTION SOLUTIONS</span>
						<span className="hidden md:inline">CONSTRUCTION SOLUTIONS</span> */}
						MAKING THE WORLD SAFER
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className={`${outfit.className} text-blue-600 text-lg md:text-3xl max-w-3xl`}
					>
						Ladwa Partners is an online portal by Ladwa Safety Inc.
					</motion.p>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className={`${outfit.className} text-blue-600 text-sm md:text-base mt-4 md:mt-10 max-w-xl`}
					>
						{/* Safety is the most basic yet the most important rule of life. It is
						the sum of safety precautions that determines the safety of the
						people working near you. */}
						Ladwa Partner is an online dealer portal by Ladwa Safety Inc., a
						pioneer in the manufacture, supply, and export of Traffic Safety
						Equipment, Industrial Safety Equipment, Security Equipment,
						Barrication & Retro reflective signages.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className={`${outfit.className} flex flex-wrap items-center gap-4`}
					>
						<Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 md:px-6 md:py-2 rounded-md text-sm md:text-base">
							Get Started
						</Button>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="flex items-center gap-6 md:gap-10 pt-4"
					>
						<div>
							<h3 className="text-blue-600 text-xl md:text-2xl font-bold text-center mb-1">
								8K+
							</h3>
							<p className="text-blue-600 text-sm md:text-base">
								Project Completed
							</p>
						</div>
						<div>
							<h3 className="text-blue-600 text-xl md:text-2xl font-bold text-center mb-1">
								5.5K+
							</h3>
							<p className="text-blue-600 text-sm md:text-base">
								Customers Happy
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
