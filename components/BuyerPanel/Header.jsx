"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/ladwapartners.png";

import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, Heart, User, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCartStore } from "@/store/cartStore";
import MiniCart from "./cart/MiniCart";
import {
        useUserFullName,
        useUserEmail,
        useUserProfilePic,
        useIsAuthenticated,
} from "@/store/authStore.js";

export default function Header({ onMenuToggle, isMenuOpen }) {
	const fullName = useUserFullName();
	const email = useUserEmail();
	const profilePic = useUserProfilePic();
        const isAuthenticated = useIsAuthenticated();

        const initials =
                fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "";
        const pastelColors = [
                "bg-red-200",
                "bg-green-200",
                "bg-blue-200",
                "bg-yellow-200",
                "bg-purple-200",
                "bg-pink-200",
                "bg-indigo-200",
                "bg-teal-200",
        ];
        const colorClass =
                pastelColors[
                        initials
                                ? (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) %
                                  pastelColors.length
                                : 0
                ];

	// console.log("isAuthenticated", isAuthenticated);

	const { getTotalItems, openCart } = useCartStore();
	const totalItems = getTotalItems();

	const handleCartClick = () => {
		openCart();
	};

	return (
		<>
                        <header className="sticky top-0 w-full z-50 bg-white border-b border-white/80">
	<div className="px-4 lg:px-10">
		{/* Top Bar */}
		<div className="flex items-center justify-between py-3">
			{/* Desktop Menu */}
			<div className="hidden lg:block bg-white rounded-full">
				<Button variant="ghost" size="icon" onClick={onMenuToggle}>
					{isMenuOpen ? (
						<X className="h-6 w-6 text-black" />
					) : (
						<Menu className="h-6 w-6 text-black" />
					)}
				</Button>
			</div>

			<div className="flex items-center space-x-2 md:space-x-4">
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden text-black"
					onClick={onMenuToggle}
				>
					{isMenuOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</Button>

				<Link
					href="/"
					className="flex items-center justify-center space-x-2 text-black font-semibold"
				>
					<Image
						src={Logo}
						alt="Ladwa Partners Logo"
						width={150} 

					/>
				</Link>
			</div>

                        <div className="flex items-center space-x-2 md:space-x-4">
                                {isAuthenticated && (
                                        <>
                                                <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="relative text-black bg-white rounded-full"
                                                        onClick={handleCartClick}
                                                >
                                                        <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                                                        {totalItems > 0 && (
                                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                                        {totalItems > 99 ? "99+" : totalItems}
                                                                </span>
                                                        )}
                                                </Button>
                                                <Link href="/wishlist">
                                                        <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="bg-white rounded-full"
                                                        >
                                                                <Heart className="h-5 w-5 md:h-6 md:w-6" />
                                                        </Button>
                                                </Link>
                                        </>
                                )}

                                {isAuthenticated ? (
                                        <div className="flex items-center space-x-2 md:space-x-4">
                                                <Link href="/account/profile">
                                                        <div className="flex items-center space-x-2">
                                                                <Avatar className="h-6 w-6 md:h-8 md:w-8">
                                                                        {profilePic && (
                                                                                <AvatarImage
                                                                                        src={profilePic}
                                                                                        alt="Profile"
                                                                                />
                                                                        )}
                                                                        <AvatarFallback
                                                                                className={`${colorClass} text-black text-sm`}
                                                                        >
                                                                                {initials}
                                                                        </AvatarFallback>
                                                                </Avatar>
                                                                <div className="hidden md:block text-black">
                                                                        <p className="text-sm font-medium">{fullName}</p>
                                                                        <p className="text-xs text-gray-400">{email}</p>
                                                                </div>
                                                        </div>
                                                </Link>
                                        </div>
                                ) : (
                                        <Link href="/login">
                                                <Button variant="ghost" size="icon" className="bg-white rounded-full">
                                                        <User className="h-5 w-5 md:h-6 md:w-6" />
                                                </Button>
                                        </Link>
                                )}
                        </div>
		</div>
	</div>
</header>

			<MiniCart />
		</>
	);
}
