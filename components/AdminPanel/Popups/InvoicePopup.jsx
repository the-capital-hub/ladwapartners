"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Download, Printer } from "lucide-react";
import { useAdminOrderStore } from "@/store/adminOrderStore.js";
import { toast } from "react-hot-toast";
import { companyInfo } from "@/constants/companyInfo.js";

export function InvoicePopup({ open, onOpenChange, order, downloadInvoice: downloadInvoiceProp }) {
        const { downloadInvoice: adminDownloadInvoice } = useAdminOrderStore();
        const downloadInvoice = downloadInvoiceProp || adminDownloadInvoice;

	if (!order) return null;

	const handleDownload = async () => {
		const result = await downloadInvoice(order._id, order.orderNumber);
		if (result.success) {
			toast.success("Invoice downloaded successfully");
		} else {
			toast.error("Failed to download invoice. Please try again.");
		}
	};

	const handlePrint = () => {
		window.print();
	};

	const getStatusColor = (status) => {
		const colors = {
			pending: "bg-yellow-100 text-yellow-800",
			confirmed: "bg-blue-100 text-blue-800",
			processing: "bg-purple-100 text-purple-800",
			shipped: "bg-indigo-100 text-indigo-800",
			delivered: "bg-green-100 text-green-800",
			cancelled: "bg-red-100 text-red-800",
			returned: "bg-gray-100 text-gray-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
					className="space-y-6"
				>
					{/* Header */}
                                        <div className="flex justify-between items-start">
                                                <div>
                                                        <h2 className="text-3xl font-bold text-orange-500">
                                                                {companyInfo.name}
                                                        </h2>
                                                        <p className="text-sm text-gray-600">
                                                                {companyInfo.website}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                                {companyInfo.email}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                                {companyInfo.phone}
                                                        </p>
                                                </div>
                                                <div className="text-right">
                                                        <h3 className="text-2xl font-bold mb-2">INVOICE</h3>
                                                        {companyInfo.address?.map((line, idx) => (
                                                                <p
                                                                        key={idx}
                                                                        className="text-sm text-gray-600"
                                                                >
                                                                        {line}
                                                                </p>
                                                        ))}
                                                        {companyInfo.taxId && (
                                                                <p className="text-sm text-gray-600">
                                                                        {companyInfo.taxId}
                                                                </p>
                                                        )}
                                                </div>
                                        </div>

					<Separator />

                                        {/* Invoice Details */}
                                        <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                        <h3 className="font-semibold mb-3">Bill To</h3>
                                                        {order.billToAddress ? (
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                        <p className="font-medium text-gray-800">{order.billToAddress.name}</p>
                                                                        <p>{order.billToAddress.street}</p>
                                                                        <p>
                                                                                {order.billToAddress.city}, {order.billToAddress.state}
                                                                        </p>
                                                                        <p>
                                                                                {order.billToAddress.zipCode}, {order.billToAddress.country}
                                                                        </p>
                                                                </div>
                                                        ) : (
                                                                <div className="space-y-1">
                                                                        <p className="font-medium">{order.customerName}</p>
                                                                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                                                                        <p className="text-sm text-gray-600">{order.customerMobile}</p>
                                                                </div>
                                                        )}
                                                </div>
                                                <div>
                                                        <h3 className="font-semibold mb-3">Ship To</h3>
                                                        {order.shipToAddress && (
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                        <p className="font-medium text-gray-800">{order.shipToAddress.name}</p>
                                                                        <p>{order.shipToAddress.street}</p>
                                                                        <p>
                                                                                {order.shipToAddress.city}, {order.shipToAddress.state}
                                                                        </p>
                                                                        <p>
                                                                                {order.shipToAddress.zipCode}, {order.shipToAddress.country}
                                                                        </p>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 mt-4">
                                                <div></div>
                                                <div className="text-right space-y-4">
                                                        <div>
                                                                <p className="text-sm text-gray-600">Invoice Number</p>
                                                                <p className="font-semibold">{order.orderNumber}</p>
                                                        </div>
                                                        <div>
                                                                <p className="text-sm text-gray-600">Order Date</p>
                                                                <p className="font-semibold">
                                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                                </p>
                                                        </div>
                                                        <div>
                                                                <p className="text-sm text-gray-600">Status</p>
                                                                <Badge className={getStatusColor(order.status)}>
                                                                        {order.status.toUpperCase()}
                                                                </Badge>
                                                        </div>
                                                        <div className="text-right">
                                                               <p className="text-3xl font-bold text-orange-500">
                                                                       ₹{order.totalAmount.toFixed(2)}
                                                               </p>
                                                        </div>
                                                </div>
                                        </div>

					{/* Payment Information */}
					<div className="grid grid-cols-2 gap-8">
						<div>
							<p className="text-sm text-gray-600">Payment Method</p>
							<p className="font-semibold capitalize">
								{order.paymentMethod.replace("_", " ")}
							</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-600">Payment Status</p>
							<p className="font-semibold capitalize">{order.paymentStatus}</p>
						</div>
					</div>

					<Separator />

					{/* Items Table */}
					<div>
						<div className="grid grid-cols-12 gap-4 py-3 border-b font-semibold text-sm bg-gray-50">
							<div className="col-span-6">PRODUCT</div>
							<div className="col-span-2 text-center">QTY</div>
							<div className="col-span-2 text-center">PRICE</div>
							<div className="col-span-2 text-right">TOTAL</div>
						</div>

						{order.products.map((product, index) => (
							<div
								key={index}
								className="grid grid-cols-12 gap-4 py-4 border-b"
							>
								<div className="col-span-6">
									<div className="flex items-center gap-3">
										{product.productImage && (
											<img
												src={product.productImage || "https://res.cloudinary.com/drjt9guif/image/upload/v1755848946/ladwapartnersfallback_s5zjgs.png"}
												alt={product.productName}
												className="w-12 h-12 object-cover rounded"
											/>
										)}
										<div>
											<p className="font-medium">{product.productName}</p>
											<p className="text-sm text-gray-600">
												Product ID: {product.productId}
											</p>
										</div>
									</div>
								</div>
								<div className="col-span-2 text-center flex items-center justify-center">
									{product.quantity}
								</div>
                                                               <div className="col-span-2 text-center flex items-center justify-center">
                                                                       ₹{product.price.toFixed(2)}
                                                               </div>
                                                               <div className="col-span-2 text-right flex items-center justify-end">
                                                                       ₹{product.totalPrice.toFixed(2)}
                                                               </div>
							</div>
						))}
					</div>

					{/* Totals */}
					<div className="space-y-3">
						<div className="flex justify-between">
                                                       <span>Subtotal</span>
                                                       <span>₹{order.subtotal.toFixed(2)}</span>
						</div>
                                                {order.tax > 0 && (
                                                        <div className="space-y-1">
                                                                <div className="flex justify-between">
                                                               <span>GST (18%)</span>
                                                               <span>₹{order.tax.toFixed(2)}</span>
                                                                </div>
                                                                {order.gst?.cgst > 0 && (
                                                                        <div className="flex justify-between text-xs pl-2">
                                                                               <span>CGST (9%)</span>
                                                                               <span>₹{order.gst.cgst.toFixed(2)}</span>
                                                                        </div>
                                                                )}
                                                                {order.gst?.sgst > 0 && (
                                                                        <div className="flex justify-between text-xs pl-2">
                                                                               <span>SGST (9%)</span>
                                                                               <span>₹{order.gst.sgst.toFixed(2)}</span>
                                                                        </div>
                                                                )}
                                                                {order.gst?.igst > 0 && (
                                                                        <div className="flex justify-between text-xs pl-2">
                                                                               <span>IGST (18%)</span>
                                                                               <span>₹{order.gst.igst.toFixed(2)}</span>
                                                                        </div>
                                                                )}
                                                        </div>
                                                )}
						{order.shippingCost > 0 && (
							<div className="flex justify-between">
                                                       <span>Shipping</span>
                                                       <span>₹{order.shippingCost.toFixed(2)}</span>
							</div>
						)}
						{order.discount > 0 && (
							<div className="flex justify-between text-green-600">
                                                       <span>Discount</span>
                                                       <span>-₹{order.discount.toFixed(2)}</span>
							</div>
						)}
						{order.couponApplied && (
							<div className="flex justify-between text-blue-600">
                                                       <span>Coupon ({order.couponApplied.couponCode})</span>
                                                       <span>-₹{order.couponApplied.discountAmount.toFixed(2)}</span>
							</div>
						)}
						<Separator />
						<div className="flex justify-between font-bold text-lg">
                                                       <span>Total Amount</span>
                                                       <span>₹{order.totalAmount.toFixed(2)}</span>
						</div>
					</div>

					<Separator />

					{/* Footer */}
					<div className="space-y-4">
						<p className="font-semibold">Thank you for your business!</p>
						<div>
							<p className="font-semibold">Terms & Conditions</p>
							<p className="text-sm text-gray-600">
								Please contact us for any queries regarding this order. For
								returns and refunds, please refer to our return policy.
							</p>
						</div>
						{order.orderNotes && (
							<div>
								<p className="font-semibold">Order Notes</p>
								<p className="text-sm text-gray-600">{order.orderNotes}</p>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-4">
						<Button
							className="flex-1 bg-orange-500 hover:bg-orange-600"
							onClick={handleDownload}
						>
							<Download className="w-4 h-4 mr-2" />
							Download PDF
						</Button>
						<Button
							variant="outline"
							className="flex-1 bg-transparent"
							onClick={handlePrint}
						>
							<Printer className="w-4 h-4 mr-2" />
							Print Invoice
						</Button>
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
