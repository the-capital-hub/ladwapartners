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
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { getDirectGoogleDriveImageUrl } from "@/lib/utils";

export function BulkUploadPopup({ open, onOpenChange }) {
        const { bulkUploadProducts } = useAdminProductStore();
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [products, setProducts] = useState([]);
        const [uploadResults, setUploadResults] = useState(null);
        const [preValidationErrors, setPreValidationErrors] = useState([]);

        const parseCSV = (text) => {
                const rows = [];
                let current = "";
                let row = [];
                let inQuotes = false;

                const pushField = () => {
                        row.push(current);
                        current = "";
                };

                const pushRow = () => {
                        pushField();
                        rows.push(row);
                        row = [];
                };

                for (let i = 0; i < text.length; i++) {
                        const char = text[i];
                        if (char === '"') {
                                if (inQuotes && text[i + 1] === '"') {
                                        current += '"';
                                        i++;
                                } else {
                                        inQuotes = !inQuotes;
                                }
                        } else if (char === ',' && !inQuotes) {
                                pushField();
                        } else if ((char === '\n' || char === '\r') && !inQuotes) {
                                if (char === '\r' && text[i + 1] === '\n') i++;
                                pushRow();
                        } else {
                                current += char;
                        }
                }

                if (current.length > 0 || row.length > 0) {
                        pushRow();
                }

                const headers = rows.shift().map((h) => h.trim());
                return rows
                        .filter((r) => r.some((v) => v.trim() !== ""))
                        .map((r) => {
                                const obj = {};
                                headers.forEach((h, i) => {
                                        obj[h] = r[i] ? r[i].trim() : "";
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
                        const mapped = rows.map((row) => {
                                const singleImage =
                                        row["Main Image Link"] ||
                                        row["Feature Image"] ||
                                        row["Image"] ||
                                        row["Image Link"];

                                return {
                                        title: row["Product Name"] || row["Title"] || row["Name"],
                                        description: row["Description"] || row["Desc"],
                                        category:
                                                row["Product Category"] ||
                                                row["Category"],
                                        subCategory:
                                                row["Sub Category"] ||
                                                row["Sub-Category"] ||
                                                row["SubCategory"],
                                        hsnCode: row["HSN Code"] || row["HSN"],
                                        price: row["Price"],
                                        mrp: row["MRP"] || row["Mrp"],
                                        featureImage:
                                                getDirectGoogleDriveImageUrl(singleImage),
                                        mainImageLink:
                                                getDirectGoogleDriveImageUrl(singleImage),
                                        imageFolder:
                                                row["Images URL Link (7 images)"] ||
                                                row["Images Folder"] ||
                                                row["Image Folder"] ||
                                                row["Image Folder Link"] ||
                                                row["Google Drive Folder Link"],
                                        length: row["Length (mm)"] || row["Length"],
                                        width: row["Width (mm)"] || row["Width"],
                                        height:
                                                row["height (mm)"] ||
                                                row["Height (mm)"] ||
                                                row["Height"],
                                        weight:
                                                row["Weight (gms)"] ||
                                                row["Weight"],
                                        colour: row["Colour"] || row["Color"],
                                        material:
                                                row["Material used / Made Of"] ||
                                                row["Material"],
                                        brand: row["brand"] || row["Brand"],
                                        size: row["size"] || row["Size"],
                                };
                        });

                        const requiredFields = ["title", "price", "mrp", "category"];
                        const invalid = [];
                        const valid = [];
                        mapped.forEach((prod) => {
                                const missing = requiredFields.filter(
                                        (field) => !prod[field] || prod[field] === ""
                                );
                                if (missing.length) {
                                        invalid.push({
                                                data: prod,
                                                error: `Missing required fields: ${missing.join(", ")}`,
                                        });
                                } else {
                                        valid.push(prod);
                                }
                        });
                        setProducts(valid);
                        setPreValidationErrors(invalid);
                };
                reader.readAsText(file);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (products.length === 0 && preValidationErrors.length === 0) return;
                setIsSubmitting(true);
                const results =
                        products.length > 0
                                ? await bulkUploadProducts(products)
                                : { success: [], failed: [] };
                setUploadResults({
                        success: results?.success || [],
                        failed: [...preValidationErrors, ...(results?.failed || [])],
                        duplicates: results?.duplicates || [],
                });
                setIsSubmitting(false);
        };

        const downloadTemplate = () => {
                const headers = [
                        "Product Category",
                        "Sub Category",
                        "HSN Code",
                        "Product Name",
                        "Description",
                        "Price",
                        "MRP",
                        "Main Image Link",
                        "Images URL Link (7 images)",
                        "Length (mm)",
                        "Width (mm)",
                        "height (mm)",
                        "Weight (gms)",
                        "Colour",
                        "Material used / Made Of",
                        "brand",
                        "size",
                ];
                const sampleRow = [
                        "Sample Category",
                        "Sample Sub",
                        "HSN001",
                        "Sample Product",
                        "Sample description",
                        "100",
                        "120",
                        "https://example.com/main-image.jpg",
                        "https://drive.google.com/drive/folders/sample",
                        "10",
                        "5",
                        "3",
                        "200",
                        "Red",
                        "Plastic",
                        "BrandX",
                        "L",
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
                                                                                {uploadResults.duplicates.length > 0 && (
                                                                                        <p>
                                                                                                ⚠️ Duplicates assigned: {uploadResults.duplicates.length}{" "}
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
                                                                                <Table>
                                                                                        <TableHeader>
                                                                                                <TableRow>
                                                                                                        <TableHead>Title</TableHead>
                                                                                                        <TableHead>Error</TableHead>
                                                                                                </TableRow>
                                                                                        </TableHeader>
                                                                                        <TableBody>
                                                                                                {uploadResults.failed.map((failed, index) => (
                                                                                                        <TableRow key={index}>
                                                                                                                <TableCell>{failed.data.title || "Unknown"}</TableCell>
                                                                                                                <TableCell>{failed.error}</TableCell>
                                                                                                        </TableRow>
                                                                                                ))}
                                                                                        </TableBody>
                                                                                </Table>
                                                                        </div>
                                                                )}

                                                                {uploadResults.duplicates.length > 0 && (
                                                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                                                <h4 className="font-medium text-yellow-900 mb-2">
                                                                                        Duplicates Mapped
                                                                                </h4>
                                                                                <Table>
                                                                                        <TableHeader>
                                                                                                <TableRow>
                                                                                                        <TableHead>Title</TableHead>
                                                                                                        <TableHead>Existing Category</TableHead>
                                                                                                </TableRow>
                                                                                        </TableHeader>
                                                                                        <TableBody>
                                                                                                {uploadResults.duplicates.map((dup, index) => (
                                                                                                        <TableRow key={index}>
                                                                                                                <TableCell>{dup.title}</TableCell>
                                                                                                                <TableCell>{dup.category}</TableCell>
                                                                                                        </TableRow>
                                                                                                ))}
                                                                                        </TableBody>
                                                                                </Table>
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

