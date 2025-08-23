'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import img1 from "@/public/images/home/architect.jpg";
import img2 from "@/public/images/home/construction.png";
import img3 from "@/public/images/home/crane.png";
import img4 from "@/public/images/home/building.png";
import { Kanit, Lato } from 'next/font/google';

const kan = Kanit({
  weight: ["200", "400", "600"],  
  variable: "--font-kanit",     
  subsets: ["latin"],
});

const lato = Lato({
    variable:"--font-lato",
    subsets:["latin"],
     weight: ["100", "400", "700"],  
})

const ResearchAndDevelopment = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.6
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const overlayVariants = {
    hover: {
      backgroundColor: "rgba(0, 33, 91, 0.9)",
      transition: {
        duration: 0.3
      }
    }
  };

  const yellowOverlayVariants = {
    hover: {
      backgroundColor: "rgba(255, 184, 45, 0.8)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="w-full">
      <motion.div 
        className="hidden md:flex h-[500px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Left Image Section - 40% width, no overlay */}
        <motion.div 
          className="w-[40%] relative overflow-hidden group cursor-pointer"
          variants={sectionVariants}
          whileHover="hover"
        >
          <Image
            src={img1}
            alt="Construction framework"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
        </motion.div>

        {/* Right Content Section - 60% width */}
        <div className="w-[60%] flex">
          {/* Research & Analysis Section */}
          <motion.div 
            className="flex-1 relative overflow-hidden group cursor-pointer"
            variants={sectionVariants}
            whileHover="hover"
          >
            <Image
              src={img2}
              alt="Construction site"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <motion.div 
              className="absolute inset-0 flex flex-col px-3 py-10 bg-[#00215BD9]"
              variants={overlayVariants}
            >
              <motion.h2 
                className={`text-white text-2xl lg:text-2xl xl:text-3xl font-bold mb-4 leading-tight ${kan.className}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Quality <br />Assurance
              </motion.h2>
              <motion.p 
                className={`${lato.className} text-white text-sm lg:text-base mb-8 opacity-90`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Ensuring every stage meets the highest standards of safety and performance.<br/>
                We focus on thorough inspections, continuous monitoring, and strict compliance checks to guarantee reliability, durability, and customer confidence.
              </motion.p>
              <motion.button 
                className="w-12 h-12 lg:w-14 lg:h-14 flex items-center absolute bottom-4 right-4 bg-[#FFB82D] justify-center"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <ArrowRight className="text-white w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Industry Development Section */}
          <motion.div 
            className="flex-1 relative overflow-hidden group cursor-pointer"
            variants={sectionVariants}
            whileHover="hover"
          >
            <Image
              src={img3}
              alt="Construction crane"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <motion.div 
              className="absolute inset-0 flex flex-col items-start p-8 lg:py-10 lg:px-5 bg-[#FFB82DB2]"
              variants={yellowOverlayVariants}
            >
              <motion.h2 
                className={`text-white text-2xl lg:text-2xl xl:text-3xl font-bold mb-4 leading-tight ${kan.className} `}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Industry<br />Development
              </motion.h2>
              <motion.p 
                className={`${lato.className} text-white text-sm lg:text-base mb-8  opacity-90`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Driving innovation and growth through cutting-edge practices and modern technologies.<br/>
                We invest in scalable solutions, foster strategic partnerships, and support advancements that shape the future of our industry.
              </motion.p>
              <motion.button 
                className="w-12 h-12 lg:w-14 lg:h-14 flex items-center absolute bottom-4 right-4 justify-center bg-[#00215B]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <ArrowRight className="text-white w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Production Launch Section */}
          <motion.div 
            className="flex-1 relative overflow-hidden group cursor-pointer"
            variants={sectionVariants}
            whileHover="hover"
          >
            <Image
              src={img4}
              alt="Modern building"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <motion.div 
              className="absolute inset-0 flex flex-col lg:py-10 lg:px-4 items-start p-8 bg-[#00215BD9]"
              variants={overlayVariants}
            >
              <motion.h2 
                className={`${kan.className} text-white text-2xl lg:text-2xl xl:text-3xl font-bold mb-4 leading-tight`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Production<br />Launch
              </motion.h2>
              <motion.p 
                className={`${lato.className} text-white text-sm lg:text-base mb-8 opacity-90`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Transforming plans into reality with seamless execution and timely delivery.<br/>
                From preparation to rollout, we ensure efficiency, precision, and long-term success with every launch.
              </motion.p>
              <motion.button 
                className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center absolute bottom-4 right-4 bg-[#FFB82D]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <ArrowRight className="text-white w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Layout */}
      <motion.div 
        className="md:hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Research & Analysis Section */}
        <motion.div 
          className="relative h-80 overflow-hidden group cursor-pointer"
          variants={sectionVariants}
          whileHover="hover"
        >
          <Image
            src={img1}
            alt="Construction framework"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>

          <motion.div 
          className="relative h-80 overflow-hidden group cursor-pointer"
          variants={sectionVariants}
          whileHover="hover"
        >
          <Image
            src={img2}
            alt="Construction framework"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <motion.div 
            className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-[#00215BD9]"
            variants={overlayVariants}
          >
            <motion.h2 
              className={`${kan.className} text-white text-3xl font-bold mb-4 leading-tight`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Research &<br />Analysis
            </motion.h2>
            <motion.p 
              className={`${lato.className} text-white text-sm mb-6 max-w-xs opacity-90`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Nullam tincidunt libero eu augue<br />
              eleifend, vitae condimentum lacus
            </motion.p>
            <motion.button 
              className="w-12 h-12 flex items-center justify-center  bg-[#FFB82D] absolute bottom-4 right-4"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <ArrowRight className="text-white w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Industry Development Section */}
        <motion.div 
          className="relative h-80 overflow-hidden group cursor-pointer"
          variants={sectionVariants}
          whileHover="hover"
        >
          <Image
            src={img3}
            alt="Construction crane"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <motion.div 
            className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-[#FFB82DB2] "
            variants={yellowOverlayVariants}
          >
            <motion.h2 
              className={`${kan.className} text-white text-3xl font-bold mb-4 leading-tight`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Industry<br />Development
            </motion.h2>
            <motion.p 
              className={`${lato.className} text-white text-sm mb-6 opacity-90`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Fusce in hendrerit lectus. Morbi<br />
              vitae tortor sed turpis feugiat
            </motion.p>
            <motion.button 
              className="w-12 h-12 flex items-center justify-center bg-[#00215B] absolute bottom-4 right-4"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <ArrowRight className="text-white w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Production Launch Section */}
        <motion.div 
          className="relative h-80 overflow-hidden group cursor-pointer lg:py-10 lg:px-5"
          variants={sectionVariants}
          whileHover="hover"
        >
          <Image
            src={img4}
            alt="Modern building"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <motion.div 
            className="absolute inset-0 flex flex-col justify-center bg-[#00215BD9] items-start  p-6"
            variants={overlayVariants}
          >
            <motion.h2 
              className={`${kan.className} text-white text-3xl font-bold mb-4 leading-tight`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Production<br />Launch
            </motion.h2>
            <motion.p 
              className={`${lato.className} text-white text-sm mb-6  opacity-90`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Nullam tincidunt libero eu augue<br />
              eleifend, vitae condimentum lacus
            </motion.p>
            <motion.button 
              className="w-12 h-12 flex items-center justify-center  bg-[#FFB82D] absolute bottom-4 right-4"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <ArrowRight className="text-white w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResearchAndDevelopment;