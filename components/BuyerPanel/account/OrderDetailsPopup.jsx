"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, CreditCard, Calendar, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF.js";


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

        const downloadInvoice = async () => {
                try {

                        const blob = await generateInvoicePDF(order);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `invoice-${order.orderNumber}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        toast.success("Invoice downloaded");
                } catch (error) {
                        toast.error("Failed to generate invoice");

                }
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                        <div className="flex items-center justify-between gap-4">
                                                <DialogTitle className="text-xl font-bold">
                                                        Order Details - {order.orderNumber}
                                                </DialogTitle>
                                                <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={downloadInvoice}
                                                >
                                                        <Download className="w-4 h-4 mr-2" /> Invoice
                                                </Button>
                                        </div>
                                </DialogHeader>

                                <div className="space-y-6 mt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <Card>
                                                        <CardContent className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                        <Package className="w-8 h-8 text-blue-600" />
                                                                        <div>
                                                                                <p className="text-sm text-gray-600">Order Status</p>
                                                                                <Badge className={getStatusColor(order.status)}>
                                                                                        {order.status}
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
                                                                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                                                                        {order.paymentStatus}
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

                                        {order.deliveryAddress && (
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <MapPin className="w-5 h-5" />
                                                                        Delivery Address
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <div className="space-y-1">
                                                                        {order.deliveryAddress.street && <p>{order.deliveryAddress.street}</p>}
                                                                        <p>
                                                                                {order.deliveryAddress.city}, {order.deliveryAddress.state}
                                                                        </p>
                                                                        <p>
                                                                                {order.deliveryAddress.zipCode}, {order.deliveryAddress.country}
                                                                        </p>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        )}

                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Products ({order.products.length} items)</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="space-y-4">
                                                                {order.products.map((product, index) => (
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
                                                                                                Qty: {product.quantity} × ₹{product.price.toFixed(2)}
                                                                                        </p>
                                                                                </div>
                                                                                <p className="font-medium">₹{product.totalPrice.toFixed(2)}</p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Order Summary</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="space-y-2">
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
                                                                <Separator className="my-2" />
                                                                <div className="flex justify-between font-semibold">
                                                                        <span>Total</span>
                                                                        <span>₹{order.totalAmount.toFixed(2)}</span>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </div>
                        </DialogContent>
                </Dialog>
        );
}
