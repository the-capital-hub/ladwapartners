"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	ArrowLeft,
	ShoppingCart,
	ChevronLeft, ChevronRight,
	Heart,

	Minus,
	Plus,
	MapPin,
	Truck,
	CreditCard,
	Star,
	User,
	RotateCcw,
	Home,
	AlertCircle,
	Receipt,
	Lock,
	HelpCircle,
	Share,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/BuyerPanel/products/ProductCard.jsx";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useIsAuthenticated } from "@/store/authStore";
import ReviewAndRatings from "./ReviewAndRatings";
import { getDirectGoogleDriveImageUrl } from "@/lib/utils";

export default function ProductDetail({ product, relatedProducts = [] }) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
        const [selectedQuantityOffer, setSelectedQuantityOffer] = useState(null);
        const router = useRouter();
        const isAuthenticated = useIsAuthenticated();
        const { addItem, isLoading } = useCartStore();

        const fallbackMainImage =
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755168534/safetyonline_fks0th.png";
        const fallbackThumbImage =
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755848946/ladwapartnersfallback_s5zjgs.png";

        const mainImageSrc = getDirectGoogleDriveImageUrl(
                product.images?.[selectedImage] ||
                        product.image ||
                        fallbackMainImage
        );
        const isMainImageUnoptimized = mainImageSrc.includes("google");

	// Mock reviews data - you can replace this with real reviews from the API
	const reviews = [
		{
			id: 1,
			name: "KL RAHUL KUMAR KARTHIK",
			rating: 5,
			comment: `The ${product.name} offers superior protection and quality. Each item is carefully crafted to meet ISI standards, ensuring high-quality safety for demanding work conditions. Whether you're working in construction or industrial environments, this product delivers excellent value.`,
		},
		{
			id: 2,
			name: "VAIBHAV SHARMA",
			rating: 5,
			comment: `Excellent quality ${product.name}. The build quality is outstanding and it provides great value for money. Highly recommended for professional use.`,
		},
		{
			id: 3,
			name: "ANITA GUPTA",
			rating: 4,
			comment: `Good product overall. The ${product.name} meets expectations and the delivery was prompt. Would purchase again.`,
		},
		{
			id: 4,
			name: "RAJESH MEHTA",
			rating: 4,
			comment: `Quality product with good durability. The ${product.name} is well-designed and serves its purpose effectively.`,
		},
	];

	const quantityOffers = [
		{
			qty: 2,
			price: Math.round(product.price * 0.95),
			discount: 5,
			label: "Qty 2",
		},
		{
			qty: 3,
			price: Math.round(product.price * 0.9),
			discount: 10,
			label: "Qty 3",
		},
		{
			qty: 5,
			price: Math.round(product.price * 0.85),
			discount: 15,
			label: "Qty 5",
		},
		{
			qty: 10,
			price: Math.round(product.price * 0.8),
			discount: 20,
			label: "Qty 10",
		},
	];

	const handleAddToCart = async (e) => {
		e.stopPropagation();

               // Use the unified addItem function
               await addItem(
                       {
                               id: product.id || product._id,
                               name: product.title,
                               description: product.description,
                               price: product.price,
                               originalPrice: product.originalPrice,
                               image: product.images?.[0] || product.image,
                               inStock: product.inStock,
                       },
                       quantity
               );
	};

	const handleBuyNow = async (e) => {
		e.stopPropagation();

		// Redirect to checkout with buy now parameters
		router.push(
			`/checkout?buyNow=true&id=${product.id || product._id}&qty=${quantity}`
		);
	};

	const handleQuantityChange = (change) => {
		const newQuantity = quantity + change;
		if (newQuantity >= 1 && newQuantity <= product.stocks) {
			setQuantity(newQuantity);
		}
	};



	// const colors = [
	// 	"bg-blue-500",
	// 	"bg-black",
	// 	"bg-red-500",
	// 	"bg-orange-500",
	// 	"bg-gray-500",
	// ];

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
					}`}
			/>
		));
	};

	if (!product) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Product Not Found
					</h1>
					<p className="text-gray-600 mb-8">
						The requested product could not be found.
					</p>
					<Link href="/products">
						<Button className="bg-black text-white hover:bg-gray-800">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Products
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 lg:px-10 py-5">
				{/* Product Details */}
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
						{/* Product Images Section */}
						<div className="relative">
							{/* Main Product Image */}
                                                        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                                                                <div className="relative h-96 md:h-[66vh]">
                                                                        <Image
                                                                                src={mainImageSrc}
                                                                                alt={product.name}
                                                                                fill
                                                                                sizes="100vw"
                                                                                className="object-contain p-8"
                                                                                unoptimized={isMainImageUnoptimized}
                                                                        />
                                                                </div>
                                                        </div>

							{/* Share and Wishlist Icons - positioned on right side */}
							<div className="absolute top-0 right-0 flex flex-col items-center space-y-2 p-2">
								<button className="p-2 hover:bg-gray-200 rounded-xl bg-gray-100">
									<Share className="h-5 w-5 text-black" />
								</button>
								<button className="p-2 hover:bg-gray-200 rounded-xl bg-gray-100">
									<Heart className="h-5 w-5 text-black" />
								</button>
							</div>

							{/* Navigation arrows - positioned at bottom right */}
							<div className="absolute bottom-[24%] right-2 flex flex-col space-y-2">
								<button className="bg-gray-100 rounded-xl p-2  hover:bg-gray-200">
									<ChevronLeft className="h-5 w-5 text-black" />
								</button>
								<button className="bg-gray-100 rounded-xl p-2 hover:bg-gray-200">
									<ChevronRight className="h-5 w-5 text-black" />
								</button>
							</div>

							{/* Thumbnail Images */}
                                                        <div className="flex gap-2 mt-4">
                                                                {product.images?.slice(0, 4).map((image, index) => {
                                                                        const src = getDirectGoogleDriveImageUrl(
                                                                                image ||
                                                                                        fallbackThumbImage
                                                                        );
                                                                        const unopt = src.includes("google");
                                                                        return (
                                                                                <button
                                                                                        key={index}
                                                                                        onClick={() => setSelectedImage(index)}
                                                                                        className={`relative w-16 h-16 md:w-20 md:h-20 border rounded-lg overflow-hidden flex-shrink-0 ${selectedImage === index
                                                                                                ? "border-blue-500"
                                                                                                : "border-gray-200 hover:border-gray-300"
                                                                                                }`}
                                                                                >
                                                                                        <Image
                                                                                                src={src}
                                                                                                alt={`${product.name} view ${index + 1}`}
                                                                                                fill
                                                                                                sizes="80px"
                                                                                                className="object-contain p-1"
                                                                                                unoptimized={unopt}
                                                                                        />
                                                                                </button>
                                                                        );
                                                                })}
                                                        </div>
						</div>

						{/* Product Details Section */}
						<div className="">


							{/* Category */}
							<div className="text-gray-500 text-sm">
								Ladwa
							</div>

							{/* Product Name */}
							<h1 className="text-2xl mb-4 md:text-3xl font-bold text-gray-900 leading-tight">
								{product.name}
							</h1>

							{/* Rating and Reviews */}
							<div className="flex items-center justify-between gap-6 border-b-2  border-dotted">
								<div className="flex items-center gap-3 mb-4">
									<span className="text-gray-500 line-through text-lg">
										₹ {product.originalPrice?.toLocaleString()}
									</span>
									{/* Price */}
									<div className="text-3xl font-bold text-gray-900">
										₹ {product.price?.toLocaleString()}
									</div>
								</div>
								<div className="flex items-center gap-4">
									<span className="text-gray-600">
										{product.soldCount} Sold
									</span>
									<div className="flex items-center gap-1">
										<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
										<span className="font-semibold">{product.rating}</span>
									</div>
								</div>
							</div>



							{/* Update Quantity */}
							<div className="border-b-2 flex items-center py-5 gap-6 border-dotted mb-4">
								<div className="text-gray-700 font-medium mb-3">Update Qty:</div>
								<div className="flex items-center gap-4">
									<div className="flex items-center">
										<button
											onClick={() => handleQuantityChange(-1)}
											disabled={quantity <= 1}
											className="p-1 border rounded-full border-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<Minus className="h-4 w-4 text-gray-600" />
										</button>
										<span className="px-4 py-2 font-medium">
											{quantity}
										</span>
										<button
											onClick={() => handleQuantityChange(1)}
											disabled={quantity >= product.stocks}
											className="p-1 border rounded-full border-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<Plus className="h-4 w-4 text-gray-600" />
										</button>
									</div>
								</div>
							</div>

							{/* Product Description */}
							<div className="space-y-4 mb-4 text-gray-700 text-sm leading-relaxed">
								<div>
									<span className="font-semibold">Set of Four Speed Breakers:</span> {product.description.setOfFour}
								</div>
								<div>
									<span className="font-semibold">75mm Height:</span> {product.description.height}
								</div>
								<div>
									<span className="font-semibold">1 Meter Long:</span> {product.description.meterLong}
								</div>
								<div>
									<span className="font-semibold">Traffic Speed Control:</span> {product.description.trafficControl}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<button
									onClick={handleAddToCart}
									disabled={!product.inStock}
									className="flex-1 bg-blue-600 text-white py-3 px-6 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Add To Cart
								</button>
								<button
									onClick={handleBuyNow}
									disabled={!product.inStock}
									className="flex-1 bg-gray-100 border border-black text-gray-700 py-3 px-6 rounded font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Buy Now
								</button>
							</div>

                                                        {/* Product Specification */}
                                                        <div className="space-y-2 py-4 border-t border-gray-200 text-sm text-gray-600">
                                                                <h3 className="font-semibold text-black mb-2">Product Specification</h3>
                                                                <table className="w-full text-left text-sm">
                                                                        <tbody>
                                                                                {product.length && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Length</td>
                                                                                                <td>{product.length}</td>
                                                                                        </tr>
                                                                                )}
                                                                                {product.width && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Width</td>
                                                                                                <td>{product.width}</td>
                                                                                        </tr>
                                                                                )}
                                                                                {product.height && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Height</td>
                                                                                                <td>{product.height}</td>
                                                                                        </tr>
                                                                                )}
                                                                                {product.weight && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Weight</td>
                                                                                                <td>{product.weight}</td>
                                                                                        </tr>
                                                                                )}
                                                                                {product.colour && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Color</td>
                                                                                                <td>{product.colour}</td>
                                                                                        </tr>
                                                                                )}
                                                                                {product.material && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Material</td>
                                                                                                <td>{product.material}</td>
                                                                                        </tr>
                                                                                )}
                                                                                {product.brand && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Brand</td>
                                                                                                <td>{product.brand}</td>
                                                                                        </tr>
                                                                                )}
                                                                                {product.size && (
                                                                                        <tr>
                                                                                                <td className="pr-4">Size</td>
                                                                                                <td>{product.size}</td>
                                                                                        </tr>
                                                                                )}
                                                                        </tbody>
                                                                </table>
                                                                <div>
                                                                        <span className="font-semibold">Category:</span>{" "}
                                                                        <span className="text-blue-600 hover:underline cursor-pointer">
                                                                                {product.category}
                                                                        </span>
                                                                </div>
                                                        </div>
						</div>
					</div>
					<div className="text-sm text-gray-600 mb-7">
						<span className="font-semibold text-black text-lg md:text-lg"> Description:</span> {product?.description}
					</div>
				</div>

				{/* Reviews & Ratings Section */}
				<ReviewAndRatings/>

				{/* Benefits and Warranty Section */}
				{/* <motion.div
					className="mb-10"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.8 }}
				> */}
					{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
						{/* Store Benefits */}
						{/* <Card>
							<CardContent className="p-6">
								<h2 className="text-xl font-bold mb-6">Store Benefits</h2>
								<div className="space-y-4">
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<Receipt className="h-5 w-5 text-green-600" />
										<span className="font-medium">GST Invoice Available</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<Lock className="h-5 w-5 text-green-600" />
										<span className="font-medium">Secure Payments</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<HelpCircle className="h-5 w-5 text-green-600" />
										<span className="font-medium">365 Days Help Desk</span>
									</div>
								</div>
							</CardContent>
						</Card> */}

						{/* Return & Warranty Policy */}
						{/* <Card>
							<CardContent className="p-6">
								<h2 className="text-xl font-bold mb-6">
									Return & Warranty Policy
								</h2>
								<div className="space-y-4">
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<RotateCcw className="h-5 w-5 text-green-600" />
										<span className="font-medium">
											Upto 7 Days Return Policy
										</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<Home className="h-5 w-5 text-green-600" />
										<span className="font-medium">Damage Products</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<AlertCircle className="h-5 w-5 text-green-600" />
										<span className="font-medium">Wrong Product</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</motion.div> */}

				{/* Related Products */}
				{relatedProducts.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.7 }}
						className="mb-10"
					>
						<h2 className="text-2xl font-bold mb-8">Related Products</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{relatedProducts.map((relatedProduct) => (
								<ProductCard key={relatedProduct.id} product={relatedProduct} />
							))}
						</div>
					</motion.div>
				)}


			</div>
		</div>
	);
}