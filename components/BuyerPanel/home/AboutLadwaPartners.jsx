"use client";

import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import img1 from "@/public/images/home/buildersimag.png";
import img2 from "@/public/images/home/middleimg.png";
import img3 from "@/public/images/home/cautiousimg.png";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"]
});

const AboutLadwaPartners = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`${outfit.className} max-w-6xl mx-auto px-12 py-8 md:px-5 md:py-0`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-4"
      >
        {/* Left Section */}
        <div className="flex-1 space-y-6 lg:space-y-8">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="bg-[#FFB82D] text-black text-xs md:text-sm font-semibold px-4 py-2 rounded-full inline-block">
              About LADWA
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight whitespace-nowrap"
          >
            Trusted Rebuilders<br />
            Road Safety
          </motion.h2>

          {/* Workers Image */}
          <motion.div variants={scaleVariants} className="relative">
            <div>
              <Image 
                src={img1} 
                alt="Construction workers discussing road safety" 
                className="max-w-sm h-full lg:h-64 object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex">
          {/* Tunnel/Speed Limit Image with overlays - Full height in middle */}
          <motion.div variants={scaleVariants} className="relative h-full max-w-sm lg:mb-8 ">
            <div>
              <Image 
                src={img2} 
                alt="Tunnel with speed limit sign" 
                className="max-w-sm h-full object-cover"
              />
              
              {/* 100% Success Rate Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-20 -left-14 bg-[#FFB82D] text-black px-3 py-2"
              >
                <div className="text-lg md:text-xl font-bold">100%</div>
                <div className="text-xs font-medium">Success Rate</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}

          {/* Traffic Sign Image - At bottom */}
        </div>
          <motion.div variants={itemVariants} className="text-black max-w-sm flex flex-col md:p-0 mb-6 lg:mb-8">
            <div>
            <p className="text-sm md:text-base lg:text-2xl leading-relaxed mb-4 md:mb-6 text-left leading-">
              Introducing the Titan 4 Pcs 750mm High-Visibility Traffic Safety Cones with Reflective Stripes. These robust cones are perfect for ensuring safety in any setting, making them essential for effective traffic management.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FFB82D] hover:bg-yellow-600 mb-6 md:mb-6 text-black font-semibold px-4 py-2 md:px-6 md:py-3 rounded-md text-sm md:text-base transition-colors duration-200"
            >
              <Link href="https://ladwas.com/about" target="_blank" rel="noopener noreferrer">
                Learn More
              </Link>
            </motion.button>
            </div>
          <motion.div variants={scaleVariants} className="relative">
            <div className=" overflow-hidden ">
              <Image 
                src={img3} 
                alt="Traffic safety sign" 
                className="w-full h-full h-[39vh] object-cover"
              />
            </div>
          </motion.div>
          </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutLadwaPartners;