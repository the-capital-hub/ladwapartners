"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Download } from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore.js";

export function BulkUploadPopup({ open, onOpenChange }) {
        const { bulkUploadProducts } = useAdminProductStore();
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [products, setProducts] = useState([]);
        const [uploadResults, setUploadResults] = useState(null);

        const parseCSV = (text) => {
                const splitLine = (line) =>
                        line
                                .match(/("([^"]|"")*"|[^,]+)/g)
                                ?.map((v) =>
                                        v
                                                .replace(/^"|"$/g, "")
                                                .replace(/""/g, '"')
                                                .trim()
                                ) || [];

                const lines = text.trim().split(/\r?\n/);
                const headers = splitLine(lines[0]);

                return lines
                        .slice(1)
                        .filter((line) => line.trim())
                        .map((line) => {
                                const values = splitLine(line);
                                const obj = {};
                                headers.forEach((h, i) => {
                                        obj[h] = values[i];
                                });
                                return obj;
                        });
        };

        const handleFileChange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                        const text = event.target.result;
                        const rows = parseCSV(text);
                        const mapped = rows.map((row) => ({
                                title: row["Product Name"],
                                description: row["Description"],
                                category: row["Product Category"],
                                subCategory: row["Sub-Category"],
                                price: row["Price"],
                                mrp: row["MRP"],
                                mainImageLink: row["Main Image Link"],
                                length: row["Length (mm)"],
                                width: row["Width (mm)"],
                                height: row["height (mm)"],
                                weight: row["Weight (gms)"],
                                colour: row["Colour"],
                                material: row["Material used / Made Of"],
                                brand: row["brand"],
                                size: row["size"],
                        }));
                        setProducts(mapped);
                };
                reader.readAsText(file);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (products.length === 0) return;
                setIsSubmitting(true);
                const results = await bulkUploadProducts(products);
                setUploadResults(results);
                setIsSubmitting(false);
        };

        const downloadTemplate = () => {
                const headers = [
                        "Product Category",
                        "Sub-Category",
                        "SKU",
                        "Product Name",
                        "Description",
                        "Price",
                        "MRP",
                        "Feature Image",
                        "Main Image Link",
                        "Length (mm)",
                        "Width (mm)",
                        "height (mm)",
                        "Weight (gms)",
                        "Colour",
                        "Material used / Made Of",
                        "brand",
                        "size",
                        "Images URL Link",
                ];
                const sampleRow = [
                        "Sample Category",
                        "Sample Sub",
                        "SKU001",
                        "Sample Product",
                        "Sample description",
                        "100",
                        "120",
                        "https://example.com/image.jpg",
                        "https://drive.google.com/sample",
                        "10",
                        "5",
                        "3",
                        "200",
                        "Red",
                        "Plastic",
                        "BrandX",
                        "L",
                        "https://example.com/extra1.jpg|https://example.com/extra2.jpg",
                ];
                const escapeCsv = (val) =>
                        `"${String(val).replace(/"/g, '""')}"`;
                const csv = [
                        headers.map(escapeCsv).join(","),
                        sampleRow.map(escapeCsv).join(","),
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "bulk-product-template.csv";
                a.click();
                window.URL.revokeObjectURL(url);
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                >
                                        <DialogHeader>
                                                <DialogTitle className="text-xl font-semibold">
                                                        Bulk Upload Products
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-600">
                                                        Upload multiple products at once using a CSV file
                                                </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-6 mt-6">
                                                {/* Template Download */}
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <h4 className="font-medium text-blue-900">
                                                                                Need a template?
                                                                        </h4>
                                                                        <p className="text-sm text-blue-700">
                                                                                Download our CSV template to get started
                                                                        </p>
                                                                </div>
                                                                <Button
                                                                        variant="outline"
                                                                        onClick={downloadTemplate}
                                                                        className="text-blue-600 border-blue-600 bg-transparent"
                                                                >
                                                                        <Download className="w-4 h-4 mr-2" />
                                                                        Download Template
                                                                </Button>
                                                        </div>
                                                </div>

                                                {/* Upload Results */}
                                                {uploadResults && (
                                                        <div className="space-y-3">
                                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                                        <h4 className="font-medium text-green-900 mb-2">
                                                                                Upload Results
                                                                        </h4>
                                                                        <div className="text-sm text-green-700">
                                                                                <p>
                                                                                        ✅ Successfully uploaded: {uploadResults.success.length}{" "}
                                                                                        products
                                                                                </p>
                                                                                {uploadResults.failed.length > 0 && (
                                                                                        <p>
                                                                                                ❌ Failed to upload: {uploadResults.failed.length}{" "}
                                                                                                products
                                                                                        </p>
                                                                                )}
                                                                        </div>
                                                                </div>

                                                                {uploadResults.failed.length > 0 && (
                                                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                                                <h4 className="font-medium text-red-900 mb-2">
                                                                                        Failed Uploads
                                                                                </h4>
                                                                                <div className="text-sm text-red-700 space-y-1">
                                                                                        {uploadResults.failed.slice(0, 3).map((failed, index) => (
                                                                                                <p key={index}>• {failed.data.title || "Unknown"}: {failed.error}</p>
                                                                                        ))}
                                                                                        {uploadResults.failed.length > 3 && (
                                                                                                <p>... and {uploadResults.failed.length - 3} more</p>
                                                                                        )}
                                                                                </div>
                                                                        </div>
                                                                )}
                                                        </div>
                                                )}

                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
                                                                <Label htmlFor="file">Product File (CSV) *</Label>
                                                                <input
                                                                        id="file"
                                                                        type="file"
                                                                        accept=".csv"
                                                                        onChange={handleFileChange}
                                                                        className="mt-1"
                                                                        required
                                                                />
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                        Upload a CSV file with the required headers.
                                                                </p>
                                                        </div>

                                                        <DialogFooter className="flex gap-3">
                                                                <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => onOpenChange(false)}
                                                                        className="flex-1"
                                                                >
                                                                        Cancel
                                                                </Button>
                                                                <Button
                                                                        type="submit"
                                                                        disabled={isSubmitting || products.length === 0}
                                                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                                >
                                                                        <Upload className="w-4 h-4 mr-2" />
                                                                        {isSubmitting ? "Uploading..." : "Upload Products"}
                                                                </Button>
                                                        </DialogFooter>
                                                </form>
                                        </div>
                                </motion.div>
                        </DialogContent>
                </Dialog>
        );
}

