"use client";

import { useState, useEffect } from "react";
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
  const [categoryData, setCategoryData] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const {
    setSearchQuery: setGlobalSearch,
    searchQuery: globalSearch,
    currentCategory,
    setCurrentCategory,
  } = useProductStore();

  useEffect(() => {
    setSearchQuery(globalSearch);
  }, [globalSearch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories?limit=100");
        const data = await res.json();
        if (data.success) setCategoryData(data.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e) => setIsDesktop(e.matches);
    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const staticItems = [
    { id: "home", label: "Home", href: "/home" },
    { id: "about-us", label: "About us", href: "/home#about-us" },
  ];

  const orderedSlugs = [
    "road-safety",
    "fire-safety",
    "personal-safety",
    "industrial-safety",
  ];

  const dynamicItems = orderedSlugs
    .map((slug) => {
      const cat = categoryData.find((c) => c.slug === slug);
      if (!cat) return null;
      return {
        id: cat.slug,
        label: cat.name,
        subCategories: cat.subCategories || [],
      };
    })
    .filter(Boolean);

  const navItems = [...staticItems, ...dynamicItems];

  const handleCategoryClick = (categoryId, subCategory) => {
    setCurrentCategory(categoryId, subCategory);

    const params = new URLSearchParams({ category: categoryId });
    if (subCategory) {
      params.append("subCategory", subCategory);
    }

    router.push(`/products?${params.toString()}`);
    if (onMenuClose) onMenuClose();
  };

  const handleNavigation = (href) => {
    if (href.includes("#")) {
      window.location.href = href;
    } else {
      router.push(href);
    }
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
    <AnimatePresence initial={false}>
      {(isMenuOpen || isDesktop) && (
        <motion.nav
          initial={isDesktop ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-t shadow-sm overflow-hidden"
        >
          <div className="px-4 lg:px-10">
        <div className="flex items-center justify-between py-4">
          {/* Categories */}
          <div className="flex items-center space-x-4 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {navItems.map((item) => {
              if (item.href) {
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="hover:bg-gray-100"
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.label}
                  </Button>
                );
              }

              return (
                <div key={item.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    className={
                      currentCategory === item.id
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }
                    onClick={() => handleCategoryClick(item.id)}
                  >
                    {item.label}
                  </Button>
                  {item.subCategories.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-0 ml-1 hover:bg-gray-100"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.subCategories.map((sub) => {
                          const subSlug = slugify(sub);
                          return (
                            <DropdownMenuItem
                              key={subSlug}
                              onSelect={() => handleCategoryClick(item.id, subSlug)}
                            >
                              {sub}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center space-x-4"
          >
            <div className="relative">
              <Input
                placeholder="Search products..."
                className="w-64 pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4 text-gray-400" />
              </Button>
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
                  className="w-full md:w-64 pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
