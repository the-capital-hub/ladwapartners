"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useProductStore = create(
	devtools(
		persist(
			(set, get) => ({
				// Initial State
				products: [],
				filteredProducts: [],
                                filters: {
                                        categories: [],
                                        priceRange: [0, 10000],
                                        stockStatus: "all",
                                        discount: 0,
                                        type: "",
                                },
                                availableFilters: null,
                                currentCategory: "all",
                                currentSubCategory: "",
                                currentPage: 1,
                                totalPages: 1,
                                searchQuery: "",
				isLoading: false,
				error: null,
				sortBy: "createdAt",
				sortOrder: "desc",

				// Actions
				fetchProducts: async () => {
					set({ isLoading: true, error: null });

					try {
                                                const {
                                                        currentCategory,
                                                        currentSubCategory,
                                                        searchQuery,
                                                        filters,
                                                        currentPage,
                                                        sortBy,
                                                        sortOrder,
                                                } = get();

                                                const params = new URLSearchParams({
                                                        page: currentPage.toString(),
                                                        limit: "12",
                                                        sort: sortBy,
                                                        order: sortOrder,
                                                });

                                                // When specific categories are selected via filters, use them
                                                if (filters.categories.length > 0) {
                                                        params.append(
                                                                "categories",
                                                                filters.categories.join(",")
                                                        );
                                                } else {
                                                        if (currentCategory !== "all") {
                                                                params.append("category", currentCategory);
                                                        }

                                                        if (currentSubCategory) {
                                                                params.append("subCategory", currentSubCategory);
                                                        }
                                                }

						if (searchQuery) {
							params.append("search", searchQuery);
						}

						if (filters.priceRange[0] > 0) {
							params.append("minPrice", filters.priceRange[0].toString());
						}

                                                if (filters.priceRange[1] < 10000) {
                                                        params.append("maxPrice", filters.priceRange[1].toString());
                                                }

                                                if (filters.stockStatus !== "all") {
                                                        params.append("stockStatus", filters.stockStatus);
                                                }

						if (filters.discount > 0) {
							params.append("discount", filters.discount.toString());
						}

						if (filters.type) {
							params.append("type", filters.type);
						}

						const response = await fetch(`/api/products?${params}`);
						const data = await response.json();

						if (data.success) {
							set({
								products: data.products,
								filteredProducts: data.products,
								totalPages: data.pagination.totalPages,
								isLoading: false,
							});
						} else {
							set({ error: data.message, isLoading: false });
						}
					} catch (error) {
						set({
							error: "Failed to fetch products",
							isLoading: false,
						});
					}
				},

				fetchFilters: async () => {
					try {
						const response = await fetch("/api/products/filters");
						const data = await response.json();

                                                if (data.success) {
                                                        set({
                                                                availableFilters: data.filters,
                                                                filters: {
                                                                        ...get().filters,
                                                                        priceRange: [
                                                                                data.filters.priceRange.min,
                                                                                data.filters.priceRange.max,
                                                                        ],
                                                                        stockStatus: "all",
                                                                },
                                                        });
                                                }
					} catch (error) {
						console.error("Failed to fetch filters:", error);
					}
				},

                                setCurrentCategory: (category, subCategory = "") => {
                                        // Only update state here. Fetching will be handled explicitly
                                        // after related filters are applied to avoid race conditions
                                        // where outdated filters could lead to empty product lists.
                                        set({
                                                currentCategory: category,
                                                currentSubCategory: subCategory,
                                                currentPage: 1,
                                        });
                                },

				setCurrentPage: (page) => {
					set({ currentPage: page });
					get().fetchProducts();
				},

				setSearchQuery: (query) => {
					set({
						searchQuery: query,
						currentPage: 1,
					});
					get().fetchProducts();
				},

				setFilters: (newFilters) => {
					set((state) => ({
						filters: { ...state.filters, ...newFilters },
						currentPage: 1,
					}));
				},

				setSorting: (sortBy, order) => {
					set({ sortBy, sortOrder: order, currentPage: 1 });
					get().fetchProducts();
				},

				applyFilters: async () => {
					set({ currentPage: 1 });
					await get().fetchProducts();
				},

				getProductById: (id) => {
					return get().products.find((product) => product.id === id);
				},

                                // Get up to three featured products optionally filtered by current category.
				// The result is memoized to prevent returning a new array on each call, which
				// can trigger React's "getSnapshot should be cached" warning when used with
				// `useSyncExternalStore`.
				getFeaturedProducts: (() => {
					let lastProducts = null;
					let lastCategory = null;
					let cached = [];

					return () => {
						const { products, currentCategory } = get();

						if (products === lastProducts && currentCategory === lastCategory) {
							return cached;
						}

						let featured = products.filter(
							(product) =>
								product?.featured === true || product?.type === "featured"
						);

						if (currentCategory !== "all") {
							featured = featured.filter(
								(product) => product.category === currentCategory
							);
						}

						lastProducts = products;
						lastCategory = currentCategory;
                                                cached = featured.slice(0, 3);

						return cached;
					};
				})(),

				addToCart: async (productId, quantity = 1) => {
					try {
						const response = await fetch(
							`/api/products/add-to-cart/${productId}`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({ quantity }),
							}
						);

						const data = await response.json();
						return data.success;
					} catch (error) {
						console.error("Failed to add to cart:", error);
						return false;
					}
				},

				buyNow: async (productId, quantity = 1) => {
					try {
						const response = await fetch(`/api/products/buy-now/${productId}`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ quantity }),
						});

						const data = await response.json();

						if (data.success) {
							return data.redirectUrl;
						}

						return null;
					} catch (error) {
						console.error("Failed to process buy now:", error);
						return null;
					}
				},
			}),
			{
				name: "product-store",
				partialize: (state) => ({
					currentCategory: state.currentCategory,
					filters: state.filters,
					sortBy: state.sortBy,
					sortOrder: state.sortOrder,
				}),
			}
		)
	)
);
