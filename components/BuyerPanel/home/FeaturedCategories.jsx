"use client";

import { ShieldCheck, Signpost, HardHat, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedCategories() {
        const categories = [
                { name: "Road Safety", icon: ShieldCheck },
                { name: "Road Sign", icon: Signpost },
                { name: "Industrial Safety", icon: HardHat },
                { name: "Fire Safety", icon: Flame },
        ];

        return (
                <section className="py-8 md:py-16 bg-gray-50">
                        <div className="px-10 max-w-6xl mx-auto text-center">
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="max-w-3xl mx-auto"
                                >
                                        <p className="text-3xl md:text-4xl mb-8 lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight whitespace-nowrap">
                                                Featured Categories
                                        </p>
                                        <p className="text-gray-700 mb-8">
                                                Ladwa Partner is an online dealer portal by Ladwa Solutions Inc. Ladwa
                                                Solutions Inc is a pioneer in the manufacture, supply, and export of
                                                Traffic Safety Equipment, Industrial Safety Equipment, Security Equipment,
                                                Barrication & Retro reflective signages.
                                        </p>
                                </motion.div>

                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ staggerChildren: 0.1 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
                                >
                                        {categories.map((cat, index) => {
                                                const Icon = cat.icon;
                                                return (
                                                        <motion.div
                                                                key={cat.name}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
                                                        >
                                                                <Icon className="w-12 h-12 text-yellow-500 mb-4" />
                                                                <h3 className="font-semibold">{cat.name}</h3>
                                                        </motion.div>
                                                );
                                        })}
                                </motion.div>
                        </div>
                </section>
        );
}

