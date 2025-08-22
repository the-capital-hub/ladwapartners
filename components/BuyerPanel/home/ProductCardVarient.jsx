"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "@/store/authStore";

function ProductCardVarient({ product, variant = "vertical" }) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const handleViewProduct = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(`/products/${product?.id || product?._id}`);
  };

  if (variant === "horizontal") {
    return (
      <Card
        onClick={handleViewProduct}
        className="w-full hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      >
        <CardContent className="p-0 flex justify-between h-full">
          {/* Left side - Product Info */}
          <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg md:text-xl mb-2 line-clamp-2">
                    {product?.title}
                  </h3>
                  {product?.subtitle && (
                    <p className="text-gray-600 text-sm mb-2">
                      {product?.subtitle}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product?.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col mb-4">
                {isAuthenticated ? (
                  <>
                    <p className="flex font-bold text-xl md:text-2xl mb-2">
                      ₹{product?.price}
                    </p>
                    {product?.originalPrice && (
                      <div className="flex items-center">
                        <p className="text-gray-500 line-through text-sm">
                          ₹{product?.originalPrice}
                        </p>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
                          25% OFF
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-base text-gray-700 italic">
                    Please login to see price
                  </p>
                )}
              </div>
              {product?.colors && (
                <div className="flex space-x-1">
                  {product?.colors.map((color, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        color === "blue"
                          ? "bg-blue-500"
                          : color === "black"
                          ? "bg-black"
                          : color === "red"
                          ? "bg-red-500"
                          : "bg-orange-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full">
                BUY NOW
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right side - Product Image */}
          <div className="flex-1 w-full h-[300px] overflow-hidden">
            <Image
              src={
                product?.image ||
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755168534/safetyonline_fks0th.png"
              }
              alt={product?.title}
              width={300}
              height={300}
              className="w-full h-[300px] object-contain"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default vertical variant
  return (
    <Card
      onClick={handleViewProduct}
      className="w-full h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <CardContent className="h-full p-0 flex flex-col">
        {/* Product Info Header */}
        <div className="flex justify-between items-start p-4 md:p-6 flex-shrink-0">
          <div className="flex-1">
            <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-2">
              {product?.title}
            </h3>
            {product?.subtitle && (
              <p className="text-gray-600 text-sm line-clamp-1">
                {product?.subtitle}
              </p>
            )}
            <div className="flex flex-col mb-4">
              {isAuthenticated ? (
                <>
                  <p className="flex font-bold text-xl md:text-2xl mb-2">
                    ₹{product?.price}
                  </p>
                  {product?.originalPrice && (
                    <div className="flex items-center">
                      <p className="text-gray-500 line-through text-sm">
                        ₹{product?.originalPrice}
                      </p>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
                        25% OFF
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-base text-gray-700 italic">
                  Please login to see price
                </p>
              )}
            </div>
          </div>
          {product?.colors && (
            <div className="flex space-x-1 flex-shrink-0 ml-2">
              {product?.colors.map((color, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    color === "blue"
                      ? "bg-blue-500"
                      : color === "black"
                      ? "bg-black"
                      : color === "red"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {product?.description && (
          <div className="px-4 md:px-6 pb-2 flex-shrink-0">
            <p className="text-gray-600 text-sm line-clamp-2">
              {product?.description}
            </p>
          </div>
        )}

        {/* Product Image */}
        <div className="flex-1 px-4 md:px-6 mb-4">
          <div className="w-full h-full overflow-hidden">
            <img
              src={
                product?.image ||
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755168534/safetyonline_fks0th.png"
              }
              alt={product?.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center px-4 md:px-6 pb-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <Button
            disabled={!isAuthenticated}
            className="bg-black text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-800 transition-colors rounded-full"
          >
            BUY NOW
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProductCardVarient };

