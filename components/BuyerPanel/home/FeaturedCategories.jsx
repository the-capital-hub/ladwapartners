"use client";

import { useState } from "react";
import { ShieldCheck, Signpost, HardHat, Flame } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/BuyerPanel/products/ProductCard.jsx";
import products from "@/constants/products.js";

export default function FeaturedCategories() {
        const categories = [
                { name: "Road Safety", icon: ShieldCheck, slug: "road-safety" },
                { name: "Road Sign", icon: Signpost, slug: "signage" },
                { name: "Industrial Safety", icon: HardHat, slug: "industrial-safety" },
                { name: "Fire Safety", icon: Flame, slug: "fire-safety" },
        ];

        const [selectedCategory, setSelectedCategory] = useState(null);

        const filteredProducts = selectedCategory
                ? products.filter((p) => p.category === selectedCategory).slice(0, 10)
                : [];

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
                                                const isActive = selectedCategory === cat.slug;
                                                return (
                                                        <motion.div
                                                                key={cat.name}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: index * 0.1 }}
                                                                onClick={() => setSelectedCategory(cat.slug)}
                                                                className={`p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center cursor-pointer ${
                                                                        isActive ? "ring-2 ring-yellow-500" : ""
                                                                }`}
                                                        >
                                                                <Icon className="w-12 h-12 text-yellow-500 mb-4" />
                                                                <h3 className="font-semibold">{cat.name}</h3>
                                                        </motion.div>
                                                );
                                        })}
                                </motion.div>

                                {selectedCategory && (
                                        <div className="mt-8 overflow-x-auto">
                                                <div className="flex gap-6 pb-2">
                                                        {filteredProducts.map((product) => (
                                                                <div
                                                                        key={product.id}
                                                                        className="min-w-[280px] max-w-[280px] flex-shrink-0"
                                                                >
                                                                        <ProductCard
                                                                                product={{
                                                                                        id: product.id,
                                                                                        title: product.name,
                                                                                        description: product.description,
                                                                                        price: product.price,
                                                                                        salePrice: product.price,
                                                                                        images: [product.image],
                                                                                        inStock: product.inStock,
                                                                                        discountPercentage: 0,
                                                                                }}
                                                                        />
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                )}
                        </div>
                </section>
        );
}

