"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProductStore } from "@/store/productStore.js";

export default function NavigationBar({ isMenuOpen, onMenuClose }) {
  const [searchQuery, setSearchQuery] = useState("");
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
    }
  };

  return (
    <nav className={`${isMenuOpen ? "block" : "hidden"} lg:block bg-white border-t shadow-sm`}>
      <div className="px-4 lg:px-10">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {visibleCategories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className={currentCategory === category.id ? "bg-black text-white" : "hover:bg-gray-100"}
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

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
          >
            <div className="relative">
              <Input
                placeholder="Search products..."
                className="w-full sm:w-64 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}
