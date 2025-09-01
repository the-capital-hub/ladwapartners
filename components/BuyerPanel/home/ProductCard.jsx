"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useIsAuthenticated } from "@/store/authStore";
import { getDirectGoogleDriveImageUrl } from "@/lib/utils";

export default function ProductCard({ product, compact = false }) {
  const router = useRouter();
  const { addItem, isLoading } = useCartStore();
  const isAuthenticated = useIsAuthenticated();
  const [quantity, setQuantity] = useState(1);

  const fallbackImage =
    "https://res.cloudinary.com/drjt9guif/image/upload/v1755848946/ladwapartnersfallback_s5zjgs.png";
  const imageSrc = getDirectGoogleDriveImageUrl(
    product.mainImageLink || product.image || fallbackImage
  );

  const handleViewProduct = () => {
    router.push(`/products/${product.id || product._id}`);
  };

  const changeQuantity = (e, delta) => {
    e.stopPropagation();
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    await addItem(
      {
        id: product.id || product._id,
        name: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: getDirectGoogleDriveImageUrl(
          product.mainImageLink || product.image
        ),
        inStock: product.inStock,
      },
      quantity
    );
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(
      `/checkout?buyNow=true&id=${product.id || product._id}&qty=${quantity}`
    );
  };

  return (
    <Card
      onClick={handleViewProduct}
      className="w-full h-full hover:shadow-lg transition-shadow cursor-pointer"
    >
      <CardContent
        className={`h-full flex flex-col ${compact ? "p-3" : "p-4 md:p-6"}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3
              className={`font-bold ${
                compact ? "text-sm md:text-base" : "text-base md:text-lg"
              } mb-1`}
            >
              {product.title}
            </h3>
            {product.subtitle && (
              <p className="text-gray-600 text-xs md:text-sm">
                {product.subtitle}
              </p>
            )}
            <p
              className={`font-bold ${
                compact ? "text-base md:text-lg" : "text-lg md:text-xl"
              } mt-2`}
            >
              {product.price}
            </p>
          </div>
          {product.colors && (
            <div className="flex space-x-1">
              {product.colors.map((color, i) => (
                <div
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

        {product.description && (
          <p
            className={`text-gray-600 ${compact ? "text-xs" : "text-sm"} mb-2 line-clamp-3`}
          >
            {product.description}
          </p>
        )}

        <div className="mb-3">
          <img
            src={imageSrc}
            alt={product.title}
            className={`w-full ${
              compact ? "h-24 md:h-32" : "h-32 md:h-48"
            } object-contain rounded`}
          />
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <ShoppingCart
                className={compact ? "h-3 w-3" : "h-4 w-4"}
              />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart className={compact ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded-full">
              <Button
                variant="ghost"
                size="icon"
                className={compact ? "h-6 w-6" : "h-8 w-8"}
                onClick={(e) => changeQuantity(e, -1)}
              >
                <Minus className={compact ? "h-3 w-3" : "h-4 w-4"} />
              </Button>
              <span className="px-2 text-sm">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className={compact ? "h-6 w-6" : "h-8 w-8"}
                onClick={(e) => changeQuantity(e, 1)}
              >
                <Plus className={compact ? "h-3 w-3" : "h-4 w-4"} />
              </Button>
            </div>
            <Button
              onClick={handleBuyNow}
              className="bg-black text-white text-xs md:text-sm"
            >
              BUY NOW
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
