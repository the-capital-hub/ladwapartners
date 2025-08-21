"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProductStore } from "@/store/productStore.js";

export default function NavigationBar({ isMenuOpen, onMenuClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const {
    setSearchQuery: setGlobalSearch,
    currentCategory,
    setCurrentCategory,
  } = useProductStore();

  const categories = [
    { id: "all", label: "All Products" },
    { id: "personal-safety", label: "Personal Safety" },
    { id: "road-safety", label: "Road Safety" },
    { id: "signage", label: "Retro Reflective Sign" },
    { id: "industrial-safety", label: "Industrial Safety/PPE" },
    { id: "queue-management", label: "Q-Please" },
    { id: "fire-safety", label: "Fire Safety" },
    { id: "first-aid", label: "First Aid" },
    { id: "water-safety", label: "Water Safety" },
    { id: "emergency-kit", label: "Emergency Kit" },
  ];

  const VISIBLE_COUNT = 6;
  const visibleCategories = categories.slice(0, VISIBLE_COUNT);
  const hiddenCategories = categories.slice(VISIBLE_COUNT);

  const handleCategoryClick = (categoryId) => {
    setCurrentCategory(categoryId);
    router.push(`/products?category=${categoryId}`);
    if (onMenuClose) onMenuClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setGlobalSearch(searchQuery);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false); // close after search on mobile
    }
  };

  return (
    <nav
      className={`${
        isMenuOpen ? "block" : "hidden"
      } lg:block bg-white border-t shadow-sm`}
    >
      <div className="px-4 lg:px-10">
        <div className="flex items-center justify-between py-4">
          {/* Categories */}
          <div className="flex items-center space-x-4 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {visibleCategories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className={
                  currentCategory === category.id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.label}
              </Button>
            ))}
            {hiddenCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-gray-100">
                    More
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onSelect={() => handleCategoryClick(category.id)}
                    >
                      {category.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center space-x-4"
          >
            <div className="relative">
              <Input
                placeholder="Search products..."
                className="w-64 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Mobile Search Icon */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Search Box (Dropdown style) */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.form
              onSubmit={handleSearch}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden overflow-hidden px-2 pb-2"
            >
              <div className="relative py-2">
                <Input
                  placeholder="Search products..."
                  className="w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
