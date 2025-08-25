"use client";

import React from "react";
import Image from "next/image";

// Import your images
import fireExtinguisher from "@/public/fireExtinguisher.png";

const products = [
  {
    id: 1,
    title: "LADWA Median Marker - Triangle",
    description: "Along with that while user enter bulk products to the cart.",
    img: fireExtinguisher,
    bgColor: "bg-orange-500",
    textColor: "text-white",
    buttonColor: "bg-white text-orange-500",
  },
  {
    id: 2,
    title: "FIRE SAFETY - YOUR FIRST LINE OF DEFENSE",
    description: "",
    img: fireExtinguisher,
    bgColor: "bg-pink-100",
    textColor: "text-black",
    buttonColor: "bg-red-500 text-white",
  },
  {
    id: 3,
    title: "Industrial Safety",
    description: "",
    img: fireExtinguisher,
    bgColor: "bg-yellow-100",
    textColor: "text-black",
    buttonColor: "bg-yellow-500 text-white",
  },
];

const ProductsShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* First big card */}
      <div
        className={`${products[0].bgColor} rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center`}
      >
        <div className="max-w-md">
          <p className="text-sm mb-2">#1 Ladwa Products</p>
          <h2 className={`text-3xl font-bold mb-4 ${products[0].textColor}`}>
            {products[0].title}
          </h2>
          <p className={`${products[0].textColor} mb-4`}>
            {products[0].description}
          </p>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${products[0].buttonColor}`}
          >
            Shop Now
          </button>
        </div>
        <div className="mt-6 md:mt-0">
          <Image
            src={products[0].img}
            alt={products[0].title}
            width={150}
            height={150}
            priority
            sizes="(max-width: 768px) 100vw, 150px" 
          />
        </div>
      </div>

      {/* Two stacked smaller cards */}
      <div className="flex flex-col gap-6">
        {products.slice(1).map((product) => (
          <div
            key={product.id}
            className={`${product.bgColor} rounded-2xl p-6 flex justify-between items-center`}
          >
            <div>
              <p className="text-sm mb-2">#1 Ladwa Products</p>
              <h2 className={`text-xl font-bold ${product.textColor}`}>
                {product.title}
              </h2>
              {product.description && (
                <p className={`text-sm mt-2 ${product.textColor}`}>
                  {product.description}
                </p>
              )}
              <button
                className={`mt-4 px-4 py-2 rounded-md font-semibold ${product.buttonColor}`}
              >
                Shop Now
              </button>
            </div>
            <div>
              <Image
                src={product.img}
                alt={product.title}
                width={100}
                height={100}
                sizes="(max-width: 768px) 100vw, 100px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsShowcase;