"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, RotateCcw } from "lucide-react";
import { useProductStore } from "@/store/productStore.js";

export default function ProductFilters() {
	const [isOpen, setIsOpen] = useState(false);
	const { filters, availableFilters, setFilters, applyFilters, fetchFilters } =
		useProductStore();

	useEffect(() => {
		fetchFilters();
	}, [fetchFilters]);

	const handleCategoryChange = (categoryId, checked) => {
		const newCategories = checked
			? [...filters.categories, categoryId]
			: filters.categories.filter((id) => id !== categoryId);

		setFilters({ categories: newCategories });
	};

	const handlePriceChange = (value) => {
		setFilters({ priceRange: value });
	};

	const handleStockChange = (checked) => {
		setFilters({ inStock: checked });
	};

	const handleDiscountChange = (value) => {
		setFilters({ discount: Number.parseInt(value) || 0 });
	};

	const handleTypeChange = (value) => {
		setFilters({ type: value === "all" ? "" : value });
	};

	const handleApplyFilters = () => {
		applyFilters();
		setIsOpen(false);
	};

	const clearFilters = () => {
		setFilters({
			categories: [],
			priceRange: availableFilters
				? [availableFilters.priceRange.min, availableFilters.priceRange.max]
				: [0, 10000],
			inStock: false,
			discount: 0,
			type: "",
		});
		applyFilters();
	};

	if (!availableFilters) {
		return (
			<div className="inline-block">
				<Button
					variant="outline"
					disabled
					className="rounded-xl px-6 py-2 bg-transparent"
				>
					<Filter className="h-4 w-4 mr-2" />
					FILTERS
				</Button>
			</div>
		);
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="rounded-lg px-6 py-2 border-gray-300 hover:bg-gray-50 bg-transparent"
				>
					<Filter className="h-4 w-4 mr-2 text-gray-600" />
					<span className="text-gray-700 font-medium">FILTERS</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-80 h-[500px] p-0 bg-white rounded-lg shadow-lg hide-scrollbar"
				align="start"
				sideOffset={8}
			>
				<div className="p-6">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-semibold text-blue-600">Filters</h2>
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							className="text-gray-500 hover:text-gray-700"
						>
							<RotateCcw className="h-4 w-4" />
						</Button>
					</div>

					<FilterContent
						availableFilters={availableFilters}
						filters={filters}
						onCategoryChange={handleCategoryChange}
						onPriceChange={handlePriceChange}
						onStockChange={handleStockChange}
						onDiscountChange={handleDiscountChange}
						onTypeChange={handleTypeChange}
						onApply={handleApplyFilters}
					/>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function FilterContent({
	availableFilters,
	filters,
	onCategoryChange,
	onPriceChange,
	onStockChange,
	onDiscountChange,
	onTypeChange,
	onApply,
}) {
	return (
		<div className="space-y-6">
			{/* Categories */}
			<div>
				<h3 className="text-blue-600 font-medium mb-4">Filters</h3>
				<div className="space-y-3">
					{/* All option */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Checkbox
								id="all"
								checked={filters.categories.length === 0}
								onCheckedChange={(checked) => {
									if (checked) {
										onCategoryChange("all", true);
									}
								}}
								className="rounded border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
							/>
							<label
								htmlFor="all"
								className="text-sm font-medium leading-none cursor-pointer"
							>
								All (
								{availableFilters.categories.reduce(
									(sum, cat) => sum + cat.count,
									0
								)}
								)
							</label>
						</div>
						<span className="text-gray-400">›</span>
					</div>

					{availableFilters.categories.map((category) => (
						<div
							key={category.id}
							className="flex items-center justify-between"
						>
							<div className="flex items-center space-x-3">
								<Checkbox
									id={category.id}
									checked={filters.categories.includes(category.id)}
									onCheckedChange={(checked) =>
										onCategoryChange(category.id, checked)
									}
									className="rounded border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
								/>
								<label
									htmlFor={category.id}
									className="text-sm font-medium leading-none cursor-pointer"
								>
									{category.label} ({category.count})
								</label>
							</div>
							<span className="text-gray-400">›</span>
						</div>
					))}
				</div>
			</div>

			{/* Price Range */}
			<div>
				<h3 className="text-blue-600 font-medium mb-4 flex items-center justify-between">
					Price
					<span className="text-gray-400">^</span>
				</h3>
				<div className="space-y-4">
					<Slider
						value={filters.priceRange}
						onValueChange={onPriceChange}
						max={availableFilters.priceRange.max}
						min={availableFilters.priceRange.min}
						step={100}
						className="mb-4"
					/>
					<div className="flex justify-between text-sm font-medium text-blue-600">
						<span>₹{filters.priceRange[0].toLocaleString()}</span>
						<span>₹{filters.priceRange[1].toLocaleString()}</span>
					</div>
				</div>
			</div>

			{/* Availability */}
			<div>
				<h3 className="text-blue-600 font-medium mb-4 flex items-center justify-between">
					Availability
					<span className="text-gray-400">^</span>
				</h3>
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Checkbox
								id="in-stock"
								checked={filters.inStock}
								onCheckedChange={onStockChange}
								className="rounded border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
							/>
							<label
								htmlFor="in-stock"
								className="text-sm font-medium leading-none cursor-pointer"
							>
								In Stock ({availableFilters.stock.inStock})
							</label>
						</div>
						<span className="text-gray-400">›</span>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Checkbox
								id="out-of-stock"
								checked={!filters.inStock}
								onCheckedChange={(checked) => onStockChange(!checked)}
								className="rounded border-2"
							/>
							<label
								htmlFor="out-of-stock"
								className="text-sm font-medium leading-none cursor-pointer"
							>
								Out of Stock ({availableFilters.stock.outOfStock || 10})
							</label>
						</div>
						<span className="text-gray-400">›</span>
					</div>
				</div>
			</div>

			{/* Apply Button */}
			<Button
				onClick={onApply}
				className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-3 font-medium"
			>
				Apply Filter
			</Button>
		</div>
	);
}
