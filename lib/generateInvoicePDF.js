import {
        Document,
        Page,
        Text,
        View,
        Image,
        StyleSheet,
        pdf,
        Font,
} from "@react-pdf/renderer";
import { companyInfo } from "@/constants/companyInfo.js";

// Register a font with the Indian Rupee symbol (₹) using a CDN that
// supports query strings so React PDF can request only the glyphs it needs.

Font.register({
        family: "Roboto",
        fonts: [
                {

                        src: "https://cdn.jsdelivr.net/npm/@fontsource/roboto/files/roboto-all-400-normal.woff",
                        fontWeight: "normal",
                },
                {
                        src: "https://cdn.jsdelivr.net/npm/@fontsource/roboto/files/roboto-all-700-normal.woff",

                        fontWeight: "bold",
                },
        ],
});

const formatCurrency = (value) =>
        `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const styles = StyleSheet.create({
        page: {
                flexDirection: "column",
                backgroundColor: "#FFFFFF",
                padding: 30,
                fontSize: 12,
                fontFamily: "Roboto",
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
                width: "15%",
        },
        tableCell: {
                fontSize: 10,
        },
        alignRight: {
                textAlign: "right",
        },
       fullWidth: {
               width: "100%",
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
                                <View style={styles.row}>
                                        <View>
                                                <Text style={styles.sectionTitle}>Bill To:</Text>
                                                <Text>{order.customerName}</Text>
                                                <Text>{order.customerEmail}</Text>
                                                <Text>{order.customerMobile}</Text>
                                        </View>
                                        {order.deliveryAddress && (
                                                <View>
                                                        <Text style={styles.sectionTitle}>Ship To:</Text>
                                                        {order.deliveryAddress.name && (
                                                                <Text>{order.deliveryAddress.name}</Text>
                                                        )}
                                                        <Text>{order.deliveryAddress.street}</Text>
                                                        <Text>
                                                                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
                                                        </Text>
                                                        <Text>{order.deliveryAddress.country}</Text>
                                                </View>
                                        )}
                                </View>
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

                       {/* Products Table with Tax */}
                       <View style={[styles.table, styles.fullWidth]}>
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
                                               <Text style={styles.tableCell}>Tax Type</Text>
                                       </View>
                                       <View style={[styles.tableCol, styles.tableColSmall]}>
                                               <Text style={[styles.tableCell, styles.alignRight]}>Amount w/ Tax</Text>
                                       </View>
                               </View>

                               {order.products.map((product, index) => {
                                       const taxType =
                                               order.gst?.igst > 0
                                                       ? "IGST (18%)"
                                                       : order.gst?.cgst > 0 || order.gst?.sgst > 0
                                                       ? "CGST/SGST (9% each)"
                                                       : "GST";
                                       const productTax =
                                               order.tax > 0 && order.subtotal > 0
                                                       ? (product.totalPrice / order.subtotal) * order.tax
                                                       : 0;
                                       const amountWithTax = product.totalPrice + productTax;

                                       return (
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
                                                               <Text style={styles.tableCell}>{taxType}</Text>
                                                       </View>
                                                       <View style={[styles.tableCol, styles.tableColSmall]}>
                                                               <Text style={[styles.tableCell, styles.alignRight]}>
                                                                       {formatCurrency(amountWithTax)}
                                                               </Text>
                                                       </View>
                                               </View>
                                       );
                               })}
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
