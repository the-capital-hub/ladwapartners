"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
	Partner1,
	Partner2,
	Partner3,
	Partner4,
	Partner5,
	Partner6,
	Partner7,
} from "@/public/images/home/Partners/index.js";

const ClientCarousel = () => {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			align: "start",
		},
		[Autoplay({ delay: 3000 })]
	);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState([]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const scrollTo = useCallback(
		(index) => {
			if (emblaApi) emblaApi.scrollTo(index);
		},
		[emblaApi]
	);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		setScrollSnaps(emblaApi.scrollSnapList());
		emblaApi.on("select", onSelect);
	}, [emblaApi, onSelect]);

	// Sample client logos data
	const clients = [
		{
			id: 1,
			name: "Client 1",
			logo: Partner1.src,
		},
		{
			id: 2,
			name: "Client 2",
			logo: Partner2.src,
		},
		{
			id: 3,
			name: "Client 3",
			logo: Partner3.src,
		},
		{
			id: 4,
			name: "Client 4",
			logo: Partner4.src,
		},
		{
			id: 5,
			name: "Client 5",
			logo: Partner5.src,
		},
		{
			id: 6,
			name: "Client 6",
			logo: Partner6.src,
		},
		{
			id: 7,
			name: "Client 7",
			logo: Partner7.src,
		},
	];

	return (
		<div className="p-10">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="mb-8"
			>
				<h2 className="text-3xl font-bold text-center mb-2">OUR CLIENTS</h2>
				<div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
			</motion.div>

			<div className="relative">
				{/* Carousel Container */}
				<div className="embla overflow-hidden" ref={emblaRef}>
					<div className="embla__container flex">
						{clients.map((client) => (
							<div
								key={client.id}
								className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_20%] pl-4"
							>
								<div className="bg-white rounded-xl transition-all duration-300 h-40 flex items-center justify-center">
									<motion.img
										src={client.logo}
										alt={client.name}
										className="max-w-full max-h-full object-contain"
										whileHover={{ scale: 1.05 }}
										transition={{ duration: 0.2 }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Navigation Arrows */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 z-10 border border-gray-200"
					onClick={scrollPrev}
				>
					<ChevronLeft className="w-5 h-5 text-gray-700" />
				</motion.button>

				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 z-10 border border-gray-200"
					onClick={scrollNext}
				>
					<ChevronRight className="w-5 h-5 text-gray-700" />
				</motion.button>
			</div>

			{/* Dot Indicators */}
			<div className="flex justify-center items-center mt-6 space-x-2">
				{scrollSnaps.map((_, index) => (
					<motion.button
						key={index}
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						className={`w-4 h-4 rounded-full transition-all duration-300 ${
							index === selectedIndex
								? "bg-yellow-500 shadow-md"
								: "bg-gray-300 hover:bg-gray-400"
						}`}
						onClick={() => scrollTo(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default ClientCarousel;
