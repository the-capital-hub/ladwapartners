import {
        Document,
        Page,
        Text,
        View,
        Image,
        StyleSheet,
        pdf,
} from "@react-pdf/renderer";
import { companyInfo } from "@/constants/companyInfo.js";

const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
        }).format(value);

const styles = StyleSheet.create({
        page: {
                flexDirection: "column",
                backgroundColor: "#FFFFFF",
                padding: 30,
                fontSize: 12,
                fontFamily: "Helvetica",
                lineHeight: 1.5,
        },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
		borderBottom: 1,
		borderBottomColor: "#E5E5E5",
		paddingBottom: 20,
	},
        companyInfo: {
                flexDirection: "column",
        },
        logo: {
                width: 150,
                height: 50,
                marginBottom: 5,
        },
	invoiceInfo: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	invoiceTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#374151",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
        table: {
                display: "table",
                width: "auto",
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#E5E5E5",
                marginBottom: 20,
        },
        tableRow: {

                flexDirection: "row",
        },
        tableHeader: {
                backgroundColor: "#F3F4F6",
                fontWeight: "bold",
        },
        tableCol: {
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#E5E5E5",
                padding: 8,
        },
        tableColProduct: {
                width: "40%",
        },
        tableColSmall: {
                width: "20%",
        },
        tableCell: {
                fontSize: 10,
        },
        alignRight: {
                textAlign: "right",
        },
       tablesRow: {
               flexDirection: "row",
               justifyContent: "space-between",
               alignItems: "flex-start",
       },
       productTable: {
               width: "65%",
       },

       taxTable: {
               width: "30%",
       },
       fullWidth: {
               width: "100%",
       },
       halfCol: {
               width: "50%",
       },
        totalSection: {
                marginTop: 20,
                paddingTop: 20,
                borderTop: 1,
                borderTopColor: "#E5E5E5",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	grandTotal: {
		fontSize: 14,
		fontWeight: "bold",
		borderTop: 1,
		borderTopColor: "#374151",
		paddingTop: 10,
		marginTop: 10,
	},
	footer: {
		marginTop: 30,
		paddingTop: 20,
		borderTop: 1,
		borderTopColor: "#E5E5E5",
		fontSize: 10,
		color: "#6B7280",
	},
});

const InvoiceDocument = ({ order }) => {
        const logoSrc =
                typeof window === "undefined"
                        ? `${companyInfo.website}${companyInfo.logo}`
                        : companyInfo.logo;

        return (
                <Document>
                        <Page size="A4" style={styles.page}>
                                {/* Header */}
                                <View style={styles.header}>
                                        <View style={styles.companyInfo}>
                                                <Image src={logoSrc} style={styles.logo} />
                                                <Text>{companyInfo.website}</Text>
                                                <Text>{companyInfo.email}</Text>
                                                <Text>{companyInfo.phone}</Text>
                                                {companyInfo.address?.map((line, idx) => (
                                                        <Text key={idx}>{line}</Text>
                                                ))}
                                                {companyInfo.taxId && <Text>{companyInfo.taxId}</Text>}
                                        </View>
                                        <View style={styles.invoiceInfo}>
                                                <Text style={styles.invoiceTitle}>INVOICE</Text>
                                                <Text>Invoice #: {order.orderNumber}</Text>
                                                <Text>Date: {new Date(order.orderDate).toLocaleDateString()}</Text>
                                                <Text>Status: {order.status.toUpperCase()}</Text>
                                        </View>
                                </View>

			{/* Customer Information */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Bill To:</Text>
				<Text>{order.customerName}</Text>
				<Text>{order.customerEmail}</Text>
				<Text>{order.customerMobile}</Text>
				{order.deliveryAddress && (
					<Text>{order.deliveryAddress.fullAddress}</Text>
				)}
			</View>

			{/* Order Details */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Order Details:</Text>
				<View style={styles.row}>
					<Text>
						Order Date: {new Date(order.orderDate).toLocaleDateString()}
					</Text>
					<Text>
						Payment Method:{" "}
						{order.paymentMethod.replace("_", " ").toUpperCase()}
					</Text>
				</View>
				<View style={styles.row}>
					<Text>Payment Status: {order.paymentStatus.toUpperCase()}</Text>
					<Text>Order Status: {order.status.toUpperCase()}</Text>
				</View>
			</View>

                       {/* Products and Tax Tables */}
                       <View style={styles.tablesRow}>
                               <View
                                       style={[
                                               styles.table,
                                               order.tax > 0
                                                       ? styles.productTable
                                                       : styles.fullWidth,
                                       ]}
                               >
                                       <View style={[styles.tableRow, styles.tableHeader]}>
                                               <View style={[styles.tableCol, styles.tableColProduct]}>
                                                       <Text style={styles.tableCell}>Product</Text>
                                               </View>
                                               <View style={[styles.tableCol, styles.tableColSmall]}>
                                                       <Text style={styles.tableCell}>Quantity</Text>
                                               </View>
                                               <View style={[styles.tableCol, styles.tableColSmall]}>
                                                       <Text style={[styles.tableCell, styles.alignRight]}>Price</Text>

                                               </View>
                                               <View style={[styles.tableCol, styles.tableColSmall]}>
                                                       <Text style={[styles.tableCell, styles.alignRight]}>Total</Text>
                                               </View>
                                       </View>

                                       {order.products.map((product, index) => (
                                               <View style={styles.tableRow} key={index}>
                                                       <View style={[styles.tableCol, styles.tableColProduct]}>
                                                               <Text style={styles.tableCell}>{product.productName}</Text>
                                                       </View>
                                                       <View style={[styles.tableCol, styles.tableColSmall]}>
                                                               <Text style={styles.tableCell}>{product.quantity}</Text>
                                                       </View>
                                                       <View style={[styles.tableCol, styles.tableColSmall]}>
                                                               <Text style={[styles.tableCell, styles.alignRight]}>
                                                                       {formatCurrency(product.price)}
                                                               </Text>
                                                       </View>
                                                       <View style={[styles.tableCol, styles.tableColSmall]}>
                                                               <Text style={[styles.tableCell, styles.alignRight]}>
                                                                       {formatCurrency(product.totalPrice)}
                                                               </Text>
                                                       </View>
                                               </View>
                                       ))}
                               </View>

                               {order.tax > 0 && (
                                       <View style={[styles.table, styles.taxTable]}>
                                               <View style={[styles.tableRow, styles.tableHeader]}>
                                                       <View style={[styles.tableCol, styles.halfCol]}>
                                                               <Text style={styles.tableCell}>Tax Type</Text>
                                                       </View>
                                                       <View style={[styles.tableCol, styles.halfCol]}>
                                                               <Text style={styles.tableCell}>Amount</Text>
                                                       </View>
                                               </View>
                                               {order.gst?.cgst > 0 && (
                                                       <View style={styles.tableRow}>
                                                               <View style={[styles.tableCol, styles.halfCol]}>
                                                                       <Text style={styles.tableCell}>CGST (9%)</Text>
                                                               </View>
                                                               <View style={[styles.tableCol, styles.halfCol]}>
                                                                       <Text style={[styles.tableCell, styles.alignRight]}>
                                                                               {formatCurrency(order.gst.cgst)}
                                                                       </Text>
                                                               </View>
                                                       </View>
                                               )}
                                               {order.gst?.sgst > 0 && (
                                                       <View style={styles.tableRow}>
                                                               <View style={[styles.tableCol, styles.halfCol]}>
                                                                       <Text style={styles.tableCell}>SGST (9%)</Text>
                                                               </View>
                                                               <View style={[styles.tableCol, styles.halfCol]}>
                                                                       <Text style={[styles.tableCell, styles.alignRight]}>
                                                                               {formatCurrency(order.gst.sgst)}
                                                                       </Text>
                                                               </View>
                                                       </View>
                                               )}
                                               {order.gst?.igst > 0 && (
                                                       <View style={styles.tableRow}>
                                                               <View style={[styles.tableCol, styles.halfCol]}>
                                                                       <Text style={styles.tableCell}>IGST (18%)</Text>
                                                               </View>
                                                               <View style={[styles.tableCol, styles.halfCol]}>
                                                                       <Text style={[styles.tableCell, styles.alignRight]}>
                                                                               {formatCurrency(order.gst.igst)}
                                                                       </Text>
                                                               </View>
                                                       </View>
                                               )}
                                       </View>
                               )}
                       </View>


                       {/* Totals */}
                       <View style={styles.totalSection}>
                                <View style={styles.totalRow}>
                                        <Text>Subtotal:</Text>
                                        <Text style={styles.alignRight}>{formatCurrency(order.subtotal)}</Text>
                                </View>
                                {order.shippingCost > 0 && (
                                        <View style={styles.totalRow}>
                                                <Text>Shipping:</Text>
                                                <Text style={styles.alignRight}>{formatCurrency(order.shippingCost)}</Text>
                                        </View>
                                )}
                                {order.discount > 0 && (
                                        <View style={styles.totalRow}>
                                                <Text>Discount:</Text>
                                                <Text style={styles.alignRight}>-{formatCurrency(order.discount)}</Text>
                                        </View>
                                )}
                                <View style={[styles.totalRow, styles.grandTotal]}>
                                        <Text>Total Amount:</Text>
                                        <Text style={styles.alignRight}>{formatCurrency(order.totalAmount)}</Text>
                                </View>
                          </View>

			{/* Footer */}
                        <View style={styles.footer}>
                                <Text>Thank you for your business!</Text>
                                <Text>
                                        For any queries, please contact us at {companyInfo.email}
                                </Text>
                        </View>
		</Page>
        </Document>
        );
};

export const generateInvoicePDF = async (order) => {
        const doc = <InvoiceDocument order={order} />;
        // On the server we generate a Buffer, in the browser we generate a Blob
        if (typeof window === "undefined") {
                const pdfBuffer = await pdf(doc).toBuffer();
                return pdfBuffer;
        }
        const pdfBlob = await pdf(doc).toBlob();
        return pdfBlob;
};

export default InvoiceDocument;
