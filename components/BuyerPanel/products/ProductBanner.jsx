"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/productStore.js";

const styleVariants = [
  {
    bgColor: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600",
    textColor: "text-white",
    buttonColor: "bg-white text-orange-600 hover:bg-gray-100",
  },
  {
    bgColor: "bg-gradient-to-br from-pink-200 to-pink-300",
    textColor: "text-gray-800",
    buttonColor: "bg-red-500 text-white hover:bg-red-600",
  },
  {
    bgColor: "bg-gradient-to-br from-yellow-200 to-yellow-300",
    textColor: "text-gray-800",
    buttonColor: "bg-yellow-500 text-white hover:bg-yellow-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function MainBanner({ product, style, onClick }) {
  return (
    <motion.div
      className={`${style.bgColor} ${style.textColor} rounded-2xl p-8 overflow-hidden relative h-full`}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between h-full">
        <div className="flex-1 space-y-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-sm font-medium opacity-90 mb-2"># Ladwa Products</p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-lg opacity-80 max-w-md line-clamp-3">
                {product.description}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              className={`${style.buttonColor} px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg`}
              size="lg"
              onClick={onClick}
            >
              Shop Now
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0"
          variants={imageVariants}
        >
          <div className="relative">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-80 h-64 object-contain"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/15 rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CompactBanner({ product, style, onClick }) {
  return (
    <motion.div
      className={`${style.bgColor} ${style.textColor} rounded-2xl p-6 overflow-hidden relative`}
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between">
        <div className="space-y-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-xs font-medium opacity-80"># Ladwa Products</p>
            <h2 className="text-xl lg:text-2xl font-bold leading-tight mt-2">
              {product.name.toUpperCase()}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Button
              className={`${style.buttonColor} px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md`}
              onClick={onClick}
            >
              Shop Now
            </Button>
          </motion.div>
        </div>

        <motion.div className="w-32 h-auto" variants={imageVariants}>
          <div className="relative">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-24 h-20 lg:w-32 lg:h-28 object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-white/25 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProductBanner() {
  const router = useRouter();
  const featuredProducts = useProductStore((state) => state.getFeaturedProducts());

  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  const handleRedirect = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <motion.div
      className="py-4 px-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {featuredProducts.length === 1 && (
        <div className="grid grid-cols-1">
          <MainBanner
            product={featuredProducts[0]}
            style={styleVariants[0]}
            onClick={() => handleRedirect(featuredProducts[0].id || featuredProducts[0]._id)}
          />
        </div>
      )}

      {featuredProducts.length === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredProducts.map((product, idx) => (
            <MainBanner
              key={product.id || product._id}
              product={product}
              style={styleVariants[idx % styleVariants.length]}
              onClick={() => handleRedirect(product.id || product._id)}
            />
          ))}
        </div>
      )}

      {featuredProducts.length >= 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex-1">
            <MainBanner
              product={featuredProducts[0]}
              style={styleVariants[0]}
              onClick={() => handleRedirect(featuredProducts[0].id || featuredProducts[0]._id)}
            />
          </div>
          <div className="space-y-6 flex-1">
            {featuredProducts.slice(1, 3).map((product, idx) => (
              <CompactBanner
                key={product.id || product._id}
                product={product}
                style={styleVariants[(idx + 1) % styleVariants.length]}
                onClick={() => handleRedirect(product.id || product._id)}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
