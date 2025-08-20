import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Kanit, Lato } from 'next/font/google'
import img1 from "@/public/images/home/traffic.png"
import img2 from "@/public/images/home/breaker.png"

const kanit = Kanit({
    subsets: ['latin'],
    weight: ['400', '600', '700']
})

const lato = Lato({
    subsets: ['latin'],
    weight: ['300', '400', '700']
})

const WithOur = () => {
    return (
        <div className="relative bg-gray-50 py-8 md:py-16 lg:py-16">
            <div className="mx-auto max-w-9xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-[10%]">
                    {/* Left Content - Half Width */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 space-y-4 md:space-y-6 mb-8 lg:mb-0"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xs md:text-sm font-semibold text-[#D2153D] uppercase tracking-wide"
                        >
                            ABOUT US
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className={`text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#16213E] leading-tight ${kanit.className}`}
                        >
                            With our knowledge
                            <br />
                            we guarantee success
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className={`space-y-3 md:space-y-4 text-[#00215B] ${lato.className}`}
                        >
                            <p className="text-base md:text-lg font-semibold leading-relaxed">
                                Fusce id hendrerit lectus. Morbi vitae tortor sed turpis feugiat congue
                            </p>

                            <p className="text-base md:text-lg leading-relaxed opacity-90">
                                Cras tincidunt tellus at mi tristique rhoncus. Etiam dapibus rutrum leo
                                consectetur accumsan. Vivamus viverra ante turpis, dignissim condimentum
                                elit egestas sit amet. Phasellus faucibus pellentesque
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <button className="bg-[#FFB82D] hover:bg-[#e6a329] text-black font-semibold px-4 md:px-3 py-2.5 md:py-2 rounded-full transition-colors duration-300 text-sm md:text-md">
                                Explore More
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right Images */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative h-[300px] md:h-[400px] lg:h-[45vh] w-[200px] md:w-[300px] lg:w-[20vw]"
                    >
                        {/* Background Image - Circuit Breaker */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className=""
                        >
                            <Image
                                src={img2}
                                alt="Circuit Breaker"
                                fill
                                className='bg-white p-2 shadow-2xl md:p-2 lg:p-2'
                                priority
                            />
                        </motion.div>

                        {/* Foreground Image Container - Traffic Light */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="absolute -bottom-10 -left-20 md:bottom-8 md:left-8 lg:-bottom-1/2 lg:-left-1/2"
                        >
                            <div className="relative bg-white shadow-2xl p-2 md:p-4 lg:p-2">
                                {/* Play Button Overlay */}
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 md:-top-8 md:left-1/2 lg:-top-10 lg:left-1/2 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, delay: 1 }}
                                        className="bg-[#FFB82D] p-2 md:p-3 lg:p-2 cursor-pointer hover:bg-[#e6a329] transition-colors duration-300 shadow-lg"
                                    >
                                        <svg
                                            className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 text-white ml-1"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </motion.div>
                                </div>

                                <Image
                                    src={img1}
                                    alt="Traffic Light"
                                    width={150}
                                    height={150}
                                    className="object-cover md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px]"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default WithOur