"use client";

import Header from "@/components/BuyerPanel/Header.jsx";
import NavigationBar from "@/components/BuyerPanel/NavigationBar";
import Footer from "@/components/BuyerPanel/Footer.jsx";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function BuyersLayoutClient({ children, categories }) {
	const pathname = usePathname();
	const showFooter = pathname === "/home" || pathname === "/cart";
	const hideNavbar = [
		"/account/profile",
		"/account/orders",
		"/account/notifications",
		"/account/help",
	].includes(pathname);
	const [isMenuOpen, setIsMenuOpen] = useState(true);

	useEffect(() => {
		setIsMenuOpen(true);
	}, []);

	return (
                <div className="relative">
			{/* Navbar fixed over HeroSection */}
			<Header
				onMenuToggle={() => setIsMenuOpen((prev) => !prev)}
				isMenuOpen={isMenuOpen}
			/>

			{/* Category Navigation */}
			{!hideNavbar && (
				<NavigationBar
					isMenuOpen={isMenuOpen}
					onMenuClose={() => setIsMenuOpen(false)}
					categories={categories}
				/>
			)}

			{/* Main Content */}
			<main className="min-h-[calc(100vh-68px)] hide-scrollbar">
				{children}
			</main>

			{/* Footer only on specific pages */}
                        {showFooter && <Footer />}
                        <Toaster toastOptions={{ duration: 3000 }} />
                </div>
        );
}
