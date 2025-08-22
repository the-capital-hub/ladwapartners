"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/BuyerPanel/home/ProductCard.jsx";
import ServiceGuarantees from "@/components/BuyerPanel/home/ServiceGuarantees.jsx";

export default function FeaturedSection({
  topSellingProducts = [],
  bestSellingProduct = null,
  featuredProducts = [],
}) {
  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="px-10">
        {/* Featured Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            Featured Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service Guarantees */}
        <ServiceGuarantees />
      </div>
    </section>
  );
}
