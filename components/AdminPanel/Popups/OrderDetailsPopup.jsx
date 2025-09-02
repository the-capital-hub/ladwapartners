"use client";

import { motion } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Package,
	User,
	MapPin,
	CreditCard,
	Calendar,
	Phone,
	Mail,
	Truck,
} from "lucide-react";

export function OrderDetailsPopup({ open, onOpenChange, order }) {
        if (!order) return null;

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

        const getPaymentStatusColor = (status) => {
                const colors = {
                        paid: "bg-green-100 text-green-800",
                        pending: "bg-yellow-100 text-yellow-800",
                        failed: "bg-red-100 text-red-800",
                        refunded: "bg-gray-100 text-gray-800",
                };
                return colors[status] || "bg-gray-100 text-gray-800";
        };

        const formatCurrency = (value) =>
                typeof value === "number" && !Number.isNaN(value)
                        ? value.toFixed(2)
                        : "0.00";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader>
						<DialogTitle className="text-xl font-bold">
							Order Details - {order.orderNumber}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6 mt-6">
						{/* Order Status and Basic Info */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<Package className="w-8 h-8 text-blue-600" />
										<div>
											<p className="text-sm text-gray-600">Order Status</p>
											<Badge className={getStatusColor(order.status)}>
												{order.status.toUpperCase()}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<CreditCard className="w-8 h-8 text-green-600" />
										<div>
											<p className="text-sm text-gray-600">Payment Status</p>
											<Badge
												className={getPaymentStatusColor(order.paymentStatus)}
											>
												{order.paymentStatus.toUpperCase()}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<Calendar className="w-8 h-8 text-purple-600" />
										<div>
											<p className="text-sm text-gray-600">Order Date</p>
											<p className="font-medium">
												{new Date(order.orderDate).toLocaleDateString()}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Customer Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="w-5 h-5" />
									Customer Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-600">Name</p>
										<p className="font-medium">{order.customerName}</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">Email</p>
										<div className="flex items-center gap-2">
											<Mail className="w-4 h-4 text-gray-400" />
											<p className="font-medium">{order.customerEmail}</p>
										</div>
									</div>
									<div>
										<p className="text-sm text-gray-600">Phone</p>
										<div className="flex items-center gap-2">
											<Phone className="w-4 h-4 text-gray-400" />
											<p className="font-medium">{order.customerMobile}</p>
										</div>
									</div>
									<div>
										<p className="text-sm text-gray-600">Customer ID</p>
										<p className="font-medium text-blue-600">{order.userId}</p>
									</div>
								</div>
							</CardContent>
						</Card>

                                               {(order.billToAddress || order.shipToAddress) && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {order.billToAddress && (
                                                                        <Card>
                                                                                <CardHeader>
                                                                                        <CardTitle className="flex items-center gap-2">
                                                                                                <MapPin className="w-5 h-5" />
                                                                                                Bill To Address
                                                                                        </CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent>
                                                                                        <div className="space-y-2">
                                                                                                <p>{order.billToAddress.street}</p>
                                                                                                <p>
                                                                                                        {order.billToAddress.city}, {order.billToAddress.state}
                                                                                                </p>
                                                                                                <p>
                                                                                                        {order.billToAddress.zipCode}, {order.billToAddress.country}
                                                                                                </p>
                                                                                        </div>
                                                                                </CardContent>
                                                                        </Card>
                                                                )}
                                                                {order.shipToAddress && (
                                                                        <Card>
                                                                                <CardHeader>
                                                                                        <CardTitle className="flex items-center gap-2">
                                                                                                <MapPin className="w-5 h-5" />
                                                                                                Ship To Address
                                                                                        </CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent>
                                                                                        <div className="space-y-2">
                                                                                                <p>{order.shipToAddress.street}</p>
                                                                                                <p>
                                                                                                        {order.shipToAddress.city}, {order.shipToAddress.state}
                                                                                                </p>
                                                                                                <p>
                                                                                                        {order.shipToAddress.zipCode}, {order.shipToAddress.country}
                                                                                                </p>
                                                                                        </div>
                                                                                </CardContent>
                                                                        </Card>
                                                                )}
                                                        </div>
                                               )}

						{/* Products */}
						<Card>
                                                        <CardHeader>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <Package className="w-5 h-5" />
                                                                        Products ({order.products?.length || 0} items)
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <div className="space-y-4">
                                                                        {order.products?.map((product, index) => (
                                                                                <div
                                                                                        key={index}
                                                                                        className="flex items-center gap-4 p-4 border rounded-lg"
                                                                                >
                                                                                        {product.productImage && (
                                                                                                <img
                                                                                                        src={
                                                                                                                product.productImage ||
                                                                                                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755848946/ladwapartnersfallback_s5zjgs.png"
                                                                                                        }
                                                                                                        alt={product.productName}
                                                                                                        className="w-16 h-16 object-cover rounded"
                                                                                                />
                                                                                        )}
                                                                                        <div className="flex-1">
                                                                                                <h4 className="font-medium">{product.productName}</h4>
                                                                                                <p className="text-sm text-gray-600">
                                                                                                       Quantity: {product.quantity} × ₹
                                                                                                        {formatCurrency(product.price)}
                                                                                                </p>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                               <p className="font-medium">
                                                                                                       ₹{formatCurrency(product.totalPrice)}
                                                                                               </p>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </CardContent>
                                                </Card>

						{/* Payment Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CreditCard className="w-5 h-5" />
									Payment Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-600">Payment Method</p>
										<p className="font-medium capitalize">
											{order.paymentMethod.replace("_", " ")}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">Transaction ID</p>
										<p className="font-medium">
											{order.transactionId || "N/A"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Summary */}
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
                                                                        <div className="flex justify-between">
                                                                                <span>Subtotal</span>
                                                                                <span>₹{formatCurrency(order.subtotal)}</span>
                                                                        </div>
                                                                        {order.tax > 0 && (
                                                                                <div className="space-y-1">
                                                                                        <div className="flex justify-between">
                                                                                                <span>Total Tax</span>
                                                                                                <span>₹{formatCurrency(order.tax)}</span>
                                                                                        </div>
                                                                                        {order.gst?.cgst > 0 && (
                                                                                                <div className="flex justify-between text-xs pl-2">
                                                                                                        <span>CGST 9%</span>
                                                                                                        <span>₹{formatCurrency(order.gst.cgst)}</span>
                                                                                                </div>
                                                                                        )}
                                                                                        {order.gst?.sgst > 0 && (
                                                                                                <div className="flex justify-between text-xs pl-2">
                                                                                                        <span>SGST 9%</span>
                                                                                                        <span>₹{formatCurrency(order.gst.sgst)}</span>
                                                                                                </div>
                                                                                        )}
                                                                                        {order.gst?.igst > 0 && (
                                                                                                <div className="flex justify-between text-xs pl-2">
                                                                                                        <span>IGST 18%</span>
                                                                                                        <span>₹{formatCurrency(order.gst.igst)}</span>
                                                                                                </div>
                                                                                        )}
                                                                                </div>
                                                                        )}
									{order.shippingCost > 0 && (
                                                                                <div className="flex justify-between">
                                                                                        <span>Shipping</span>
                                                                                        <span>₹{formatCurrency(order.shippingCost)}</span>
                                                                                </div>
									)}
									{order.discount > 0 && (
                                                                                <div className="flex justify-between text-green-600">
                                                                                        <span>Discount</span>
                                                                                        <span>-₹{formatCurrency(order.discount)}</span>
                                                                                </div>
									)}
                                                                        {order.couponApplied?.discountAmount > 0 && (
                                                                                <div className="flex justify-between text-blue-600">
                                                                                        <span>Coupon ({order.couponApplied.couponCode})</span>
                                                                                        <span>
                                                                                                -₹{formatCurrency(order.couponApplied.discountAmount)}
                                                                                        </span>
                                                                                </div>
                                                                        )}
									<Separator />
                                                                        <div className="flex justify-between text-lg font-bold">
                                                                                <span>Total Amount</span>
                                                                                <span>₹{formatCurrency(order.totalAmount)}</span>
                                                                        </div>
								</div>
							</CardContent>
						</Card>

						{/* Tracking Information */}
						{order.trackingNumber && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Truck className="w-5 h-5" />
										Tracking Information
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-600">Tracking Number</p>
											<p className="font-medium">{order.trackingNumber}</p>
										</div>
										{order.estimatedDelivery && (
											<div>
												<p className="text-sm text-gray-600">
													Estimated Delivery
												</p>
												<p className="font-medium">
													{new Date(
														order.estimatedDelivery
													).toLocaleDateString()}
												</p>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Notes */}
						{(order.orderNotes || order.adminNotes) && (
							<Card>
								<CardHeader>
									<CardTitle>Notes</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{order.orderNotes && (
											<div>
												<p className="text-sm text-gray-600 font-medium">
													Customer Notes
												</p>
												<p className="text-sm bg-gray-50 p-3 rounded">
													{order.orderNotes}
												</p>
											</div>
										)}
										{order.adminNotes && (
											<div>
												<p className="text-sm text-gray-600 font-medium">
													Admin Notes
												</p>
												<p className="text-sm bg-blue-50 p-3 rounded">
													{order.adminNotes}
												</p>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
