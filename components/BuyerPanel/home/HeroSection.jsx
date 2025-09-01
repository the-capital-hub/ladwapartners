 "use client";


// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import hero1 from "@/public/images/home/hero1.png";
// import hero2 from "@/public/images/home/her02.png";
// import hero3 from "@/public/images/home/hero3.png";
// import HeroImgNew from "@/public/images/home/HeroImgNew.png";
import HeroImg1 from "@/public/Picture2.46f68a6d.png";
import HeroImg2 from "@/public/Picture3.a54a8aab.png";
import HeroImg3 from "@/public/Picture4.ff4c57ed-2.png";
import HeroImg4 from "@/public/Picture4.ff4c57ed.png";
import HeroImg5 from "@/public/Picture5.9054f320.png";
import HeroImg6 from "@/public/Picture6.81d7eeb4.png";
// import mobileimg from "@/public/images/home/heroimg.png";
// import { Outfit } from "next/font/google";


// const outfit = Outfit({
// 	variable: "--font-outift",
// 	subsets: ["latin"],
// });

// const HeroSection = () => {
// 	return (
// 	  <section className="relative bg-gradient-to-r from-blue-50 to-white overflow-hidden">
// 		<div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
		  
// 		  {/* Left Content */}
// 		  <div className="relative z-10">
// 			<span className="text-sm font-semibold text-blue-600 tracking-wide">
// 			  #1 Platform for Safety Products
// 			</span>
// 			<h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
// 			  MAKING THE WORLD <span className="text-blue-600">SAFER</span>
// 			</h1>
// 			<p className="mt-6 text-lg text-gray-600 leading-relaxed">
// 			  Ladwa Partners is an online portal by Ladwa Safety Inc., a pioneer in
// 			  the manufacture, supply, and export of Traffic Safety Equipment,
// 			  Industrial Safety Equipment, Security Equipment, Barrication &
// 			  Retro reflective signages.
// 			</p>
  
// 			{/* CTA Button */}
// 			<div className="mt-6">
// 			  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition">
// 				Get Started
// 			  </button>
// 			</div>
  
// 			{/* Stats */}
// 			<div className="mt-10 flex space-x-10">
// 			  <div>
// 				<p className="text-2xl font-bold text-gray-900">8K+</p>
// 				<p className="text-sm text-gray-500">Projects Completed</p>
// 			  </div>
// 			  <div>
// 				<p className="text-2xl font-bold text-gray-900">5.5K+</p>
// 				<p className="text-sm text-gray-500">Customers Happy</p>
// 			  </div>
// 			</div>
// 		  </div>
  
// 		  {/* Right Image Section */}
// 		  <div className="relative flex justify-center lg:justify-end">
// 			<motion.div
// 			  initial={{ y: 40, opacity: 0 }}
// 			  animate={{ y: 0, opacity: 1 }}
// 			  transition={{ duration: 1, ease: "easeOut" }}
// 			  className="relative"
// 			>
// 			  {/* Background Circle */}
// 			  <div className="absolute inset-0 w-[350px] h-[350px] bg-blue-100 rounded-full blur-3xl opacity-40"></div>
  
// 			  {/* Floating Product Images */}
// 			  <div className="relative flex gap-6">
// 				<motion.div
// 				  animate={{ y: [0, -15, 0] }}
// 				  transition={{ duration: 3, repeat: Infinity }}
// 				>
// 				  <Image
// 					src={HeroImg3}
// 					alt="Safety Cone"
// 					width={140}
// 					height={140}
// 					className="drop-shadow-xl"
// 				  />
// 				</motion.div>
  
// 				<motion.div
// 				  animate={{ y: [0, -20, 0] }}
// 				  transition={{ duration: 3.5, repeat: Infinity }}
// 				>
// 				  <Image
// 					src={HeroImg2}
// 					alt="Fire Extinguisher"
// 					width={140}
// 					height={140}
// 					className="drop-shadow-xl"
// 				  />
// 				</motion.div>
// 			  </div>
// 			</motion.div>
// 		  </div>
// 		</div>
// 	  </section>
// 	);
//   };
  
//   export default HeroSection;


// "use client";

//1AeEv7M61qyMHTqMRfIihE3joz3mCIUKT


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

//https://drive.google.com/file/d/1-PilweKLxiJHlxBS3kGOMIzUYXp-rvMQ/view?usp=drive_link
//https://drive.google.com/file/d/1-EfqlzZ8l1QqYWWYdRe1Dar-Ig4rErGW/view?usp=drive_link
//https://drive.google.com/file/d/1JrYdgWz1PzhV1DHsHJL28wETGQcOifMY/view?usp=drive_link
// https://drive.google.com/file/d/1OvtLrN0PPVJ-HJONambofmupRLi8E8yf/view?usp=drive_link
// https://drive.google.com/file/d/1guQtQ0yi_PmlWEW5rMu7Ef7AkrCio9JK/view?usp=drive_link
// https://drive.google.com/file/d/1NMtE6Wkrdl6rNSrYi9tr7ENIUqGJog-w/view?usp=drive_link

const productImages = [
"https://drive.google.com/uc?export=view&id=1AeEv7M61qyMHTqMRfIihE3joz3mCIUKT",
"https://drive.google.com/uc?export=view&id=1-PilweKLxiJHlxBS3kGOMIzUYXp-rvMQ",
"https://drive.google.com/uc?export=view&id=1-EfqlzZ8l1QqYWWYdRe1Dar-Ig4rErGW",
"https://drive.google.com/uc?export=view&id=1JrYdgWz1PzhV1DHsHJL28wETGQcOifMY",
"https://drive.google.com/uc?export=view&id=1OvtLrN0PPVJ-HJONambofmupRLi8E8yf",
"https://drive.google.com/uc?export=view&id=1guQtQ0yi_PmlWEW5rMu7Ef7AkrCio9JK",
"https://drive.google.com/uc?export=view&id=1NMtE6Wkrdl6rNSrYi9tr7ENIUqGJog-w",

 
 
];

const Hero = () => {
	const [index, setIndex] = useState(0);
  
	// Auto change every 3.5s
	useEffect(() => {
	  const interval = setInterval(() => {
		setIndex((prev) => (prev + 1) % productImages.length);
	  }, 3500);
	  return () => clearInterval(interval);
	}, []);
  
	// Helper: get circular index
	const getImage = (pos) => {
	  const newIndex = (index + pos + productImages.length) % productImages.length;
	  return productImages[newIndex];
	};
  
	return (
	  <section className="relative bg-gradient-to-r from-blue-50 to-white overflow-hidden">
		<div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
		  
		  {/* Left Content */}
		  <div className="relative z-20">
			<span className="text-sm font-semibold text-blue-600 tracking-wide">
			  #1 Platform for Safety Products
			</span>
			<h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
			  MAKING THE WORLD <span className="text-blue-600">SAFER</span>
			</h1>
			<p className="mt-6 text-lg text-gray-600 leading-relaxed">
			  Ladwa Partners is an online portal by Ladwa Safety Inc., a pioneer in
			  the manufacture, supply, and export of Traffic Safety Equipment,
			  Industrial Safety Equipment, Security Equipment, Barrication &
			  Retro reflective signages.
			</p>
  
			{/* CTA Button */}
			<div className="mt-6">
			  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition">
				Get Started
			  </button>
			</div>
  
			{/* Stats */}
			<div className="mt-10 flex space-x-10">
			  <div>
				<p className="text-2xl font-bold text-gray-900">8K+</p>
				<p className="text-sm text-gray-500">Projects Completed</p>
			  </div>
			  <div>
				<p className="text-2xl font-bold text-gray-900">5.5K+</p>
				<p className="text-sm text-gray-500">Customers Happy</p>
			  </div>
			</div>
		  </div>
  
		  {/* Right Carousel */}
		  <div className="relative flex justify-center lg:justify-end items-center">
			<div className="relative w-[400px] h-[320px] flex items-center justify-center">
			  {/* Left (blur preview) */}
			  <motion.div
				key={`left-${index}`}
				initial={{ opacity: 0, x: -60 }}
				animate={{ opacity: 0.5, x: -60 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.8 }}
				className="absolute left-0 blur-sm scale-75"
			  >
				<Image
				  src={getImage(-1)}
				  alt="Prev Product"
				  width={160}
				  height={160}
				  className="rounded-xl shadow-md object-contain"
				/>
			  </motion.div>
  
			  {/* Center (main image) */}
			  <AnimatePresence mode="wait">
				<motion.div
				  key={index}
				  initial={{ opacity: 0, scale: 0.9 }}
				  animate={{ opacity: 1, scale: 1 }}
				  exit={{ opacity: 0, scale: 1.1 }}
				  transition={{ duration: 0.8 }}
				  className="z-10"
				>
				  <Image
					src={getImage(0)}
					alt="Main Product"
					width={280}
					height={280}
					className="rounded-xl shadow-xl object-contain"
				  />
				</motion.div>
			  </AnimatePresence>
  
			  {/* Right (blur preview) */}
			  <motion.div
				key={`right-${index}`}
				initial={{ opacity: 0, x: 60 }}
				animate={{ opacity: 0.5, x: 60 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.8 }}
				className="absolute right-0 blur-sm scale-75"
			  >
				<Image
				  src={getImage(1)}
				  alt="Next Product"
				  width={160}
				  height={160}
				  className="rounded-xl shadow-md object-contain"
				/>
			  </motion.div>
			</div>
		  </div>
		</div>
	  </section>
	);
  };
  
  export default Hero;
