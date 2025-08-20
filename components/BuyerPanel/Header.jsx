"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/ladwapartners.png";

import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, Heart, User, X } from "lucide-react";
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

	// console.log("isAuthenticated", isAuthenticated);

	const { getTotalItems, openCart } = useCartStore();
	const totalItems = getTotalItems();

	const handleCartClick = () => {
		openCart();
	};

	return (
		<>
                        <header className="sticky top-0 w-full z-50 bg-white/10 border-b border-white/80">
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
						width={40} // adjust size as needed
						height={40}
						className="h-10 w-auto"
					/>
				</Link>
			</div>

			<div className="flex items-center space-x-2 md:space-x-4">
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
				<Button variant="ghost" size="icon" className="bg-white rounded-full">
					<Heart className="h-5 w-5 md:h-6 md:w-6" />
				</Button>

				{isAuthenticated ? (
					<div className="flex items-center space-x-2 md:space-x-4">
						<Link href="/account">
							<div className="flex items-center space-x-2">
								<Image
									src={profilePic}
									alt="Profile"
									width={40}
									height={40}
									className="h-6 w-6 md:h-8 md:w-8 rounded-full"
								/>
								<div className="hidden md:block text-white">
									<p className="text-sm font-medium">{fullName}</p>
									<p className="text-xs text-gray-300">{email}</p>
								</div>
							</div>
						</Link>
					</div>
				) : (
					<Link href="/account">
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
