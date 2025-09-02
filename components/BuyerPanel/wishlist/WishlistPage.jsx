"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
        const router = useRouter();
        const { addItem } = useCartStore();
        const [items, setItems] = useState([]);

        useEffect(() => {
                if (typeof window === "undefined") return;
                const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
                setItems(stored);
        }, []);

        const removeItem = (id) => {
                const updated = items.filter((i) => i.id !== id);
                setItems(updated);
                if (typeof window !== "undefined") {
                        localStorage.setItem("wishlist", JSON.stringify(updated));
                }
                toast.success("Removed from wishlist");
        };

       const moveToCart = async (item) => {
               // Ensure the item is added to cart before removing from wishlist
               await addItem(
                       {
                               id: item.id,
                               name: item.name,
                               description: item.description,
                               price: item.price,
                               originalPrice: item.originalPrice,
                               image: item.image,
                               inStock: item.inStock,
                       },
                       1
               );
               removeItem(item.id);
               toast.success("Moved to cart");
       };

        const handleGoBack = () => router.back();

        return (
                <div className="min-h-screen bg-gray-50">
                        <div className="container mx-auto px-4 py-8">
                                <div className="flex items-center gap-4 mb-8">
                                        <Button variant="outline" size="icon" onClick={handleGoBack}>
                                                <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                        <h1 className="text-3xl font-bold">Wishlist</h1>
                                </div>
                                {items.length === 0 ? (
                                        <Card className="max-w-md mx-auto">
                                                <CardContent className="p-8 text-center">
                                                        <p className="text-gray-600">Your wishlist is empty.</p>
                                                </CardContent>
                                        </Card>
                                ) : (
                                        <div className="space-y-4">
                                                {items.map((item) => (
                                                        <Card key={item.id}>
                                                                <CardContent className="flex items-center justify-between p-4">
                                                                        <div className="flex items-center gap-4">
                                                                                <div className="relative w-16 h-16">
                                                                                        <Image
                                                                                                src={
                                                                                                        item.image ||
                                                                                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755848946/ladwapartnersfallback_s5zjgs.png"
                                                                                                }
                                                                                                alt={item.name}
                                                                                                fill
                                                                                                className="object-contain"
                                                                                        />
                                                                                </div>
                                                                                <div>
                                                                                        <h3 className="font-semibold">{item.name}</h3>
                                                                                        <p className="text-sm text-gray-600">
                                                                                                ₹{item.price?.toLocaleString()}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="icon"
                                                                                        onClick={() => removeItem(item.id)}
                                                                                >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button size="sm" onClick={() => moveToCart(item)}>
                                                                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                                                                        Add to Cart
                                                                                </Button>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
}
