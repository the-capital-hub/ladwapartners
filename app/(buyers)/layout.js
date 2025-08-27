"use client";

import Header from "@/components/BuyerPanel/Header.jsx";
import NavigationBar from "@/components/BuyerPanel/NavigationBar";
import Footer from "@/components/BuyerPanel/Footer.jsx";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function BuyersPanelLayout({ children }) {
  const pathname = usePathname();
  const showFooter = pathname === "/home" || pathname === "/cart";
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
      <NavigationBar
        isMenuOpen={isMenuOpen}
        onMenuClose={() => setIsMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-68px)] hide-scrollbar">
        {children}
      </main>

      {/* Footer only on specific pages */}
      {showFooter && <Footer />}
    </div>
  );
}
