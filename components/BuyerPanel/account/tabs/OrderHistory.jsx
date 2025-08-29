"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { Eye, Download } from "lucide-react";
import { useLoggedInUser } from "@/store/authStore";
import { OrderDetailsPopup } from "@/components/BuyerPanel/account/OrderDetailsPopup";

const getStatusColor = (status) => {
        const colors = {
                delivered: "bg-green-100 text-green-800",
                shipped: "bg-blue-100 text-blue-800",
                processing: "bg-yellow-100 text-yellow-800",
                pending: "bg-yellow-100 text-yellow-800",
                cancelled: "bg-red-100 text-red-800",
                returned: "bg-gray-100 text-gray-800",
                confirmed: "bg-blue-100 text-blue-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
};

const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
                opacity: 1,
                transition: {
                        staggerChildren: 0.1,
                },
        },
};

const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
};

export function OrderHistory() {
        const user = useLoggedInUser();
        const [orders, setOrders] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [selectedOrder, setSelectedOrder] = useState(null);
        const [showDetails, setShowDetails] = useState(false);

        useEffect(() => {
                if (!user?._id) return;

                const fetchOrders = async () => {
                        setLoading(true);
                        setError(null);
                        try {
                                const res = await fetch(`/api/orders?userId=${user._id}`);
                                const data = await res.json();
                                if (data.success) {
                                        setOrders(data.orders || []);
                                } else {
                                        setError(data.error || "Failed to fetch orders");
                                }
                        } catch (err) {
                                setError(err.message);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchOrders();
        }, [user?._id]);

        const openDetails = (order) => {
                setSelectedOrder(order);
                setShowDetails(true);
        };

        return (
                <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                        <CardTitle>Orders History</CardTitle>
                                        <CardDescription>View and manage your order history</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                </Button>
                        </CardHeader>
                        <CardContent>
                                {loading ? (
                                        <div className="p-4 text-center">Loading...</div>
                                ) : error ? (
                                        <div className="p-4 text-center text-red-500">{error}</div>
                                ) : orders.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground">
                                                No orders found
                                        </div>
                                ) : (
                                        <motion.div
                                                variants={tableVariants}
                                                initial="hidden"
                                                animate="visible"
                                        >
                                                <Table>
                                                        <TableHeader>
                                                                <TableRow>
                                                                        <TableHead>Order ID</TableHead>
                                                                        <TableHead>Products</TableHead>
                                                                        <TableHead>Qty</TableHead>
                                                                        <TableHead>Order Date</TableHead>
                                                                        <TableHead>Price</TableHead>
                                                                        <TableHead>Status</TableHead>
                                                                        <TableHead>Actions</TableHead>
                                                                </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                                {orders.map((order) => {
                                                                        const firstProduct = order.products?.[0];
                                                                        const productName =
                                                                                firstProduct?.productName ||
                                                                                firstProduct?.productId?.title ||
                                                                                "Product";
                                                                        const totalQty = order.products?.reduce(
                                                                                (sum, p) => sum + (p.quantity || 0),
                                                                                0
                                                                        );
                                                                        return (
                                                                                <motion.tr
                                                                                        key={order._id}
                                                                                        variants={rowVariants}
                                                                                        className="hover:bg-muted/50 transition-colors"
                                                                                >
                                                                                        <TableCell className="font-medium">
                                                                                                {order.orderNumber}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <div>
                                                                                                        <div className="font-medium">
                                                                                                                {productName}
                                                                                                        </div>
                                                                                                        {order.products.length > 1 && (
                                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                                        +{order.products.length - 1} more
                                                                                                                </div>
                                                                                                        )}
                                                                                                </div>
                                                                                        </TableCell>
                                                                                        <TableCell>{totalQty}</TableCell>
                                                                                        <TableCell>
                                                                                                {new Date(order.orderDate).toLocaleDateString()}
                                                                                        </TableCell>
                                                                                        <TableCell className="font-medium">
                                                                                               ₹{order.totalAmount.toFixed(2)}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <Badge className={getStatusColor(order.status)}>
                                                                                                        {order.status.charAt(0).toUpperCase() +
                                                                                                                order.status.slice(1)}
                                                                                                </Badge>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <Button
                                                                                                        variant="ghost"
                                                                                                        size="sm"
                                                                                                        onClick={() => openDetails(order)}
                                                                                                >
                                                                                                        <Eye className="h-4 w-4" />
                                                                                                </Button>
                                                                                        </TableCell>
                                                                                </motion.tr>
                                                                        );
                                                                })}
                                                        </TableBody>
                                                </Table>
                                        </motion.div>
                                )}
                        </CardContent>
                        <OrderDetailsPopup
                                open={showDetails}
                                onOpenChange={setShowDetails}
                                order={selectedOrder}
                        />
                </Card>
        );
}
