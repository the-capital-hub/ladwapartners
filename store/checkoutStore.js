"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { toast } from "react-hot-toast";

// Payment API functions
const paymentAPI = {
	async createRazorpayOrder(orderData) {
		const response = await fetch("/api/razorpay", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(orderData),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to create payment order");
		}
		return response.json();
	},

	async verifyPayment(paymentData) {
		const response = await fetch("/api/paymentverify", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(paymentData),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Payment verification failed");
		}
		return response.json();
	},

	async createOrder(orderData) {
		const response = await fetch("/api/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(orderData),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to create order");
		}
		return response.json();
	},

	async validateCoupon(couponCode, orderAmount) {
		const response = await fetch("/api/coupons/validate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ code: couponCode, orderAmount }),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to validate coupon");
		}
		return response.json();
	},

	async getUserAddresses() {
		const response = await fetch("/api/user/addresses", {
			method: "GET", // Changed from POST to GET
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to fetch addresses");
		}
		return response.json();
	},

	async addUserAddress(addressData) {
		const response = await fetch("/api/user/addresses", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(addressData),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to add address");
		}
		return response.json();
	},
};

export const useCheckoutStore = create(
	devtools(
		persist(
			(set, get) => ({
				// State
				checkoutType: "cart", // 'cart' or 'buyNow'
				buyNowProduct: null,
				buyNowQuantity: 1,

				// Customer Information (auto-filled from user)
				customerInfo: {
					name: "",
					email: "",
					mobile: "",
				},

                                // Delivery Address Management
                                savedAddresses: [],
                                billingAddress: null,
                                selectedAddressId: null,
                                newAddress: {
                                        tag: "home",
                                        name: "",
                                        street: "",
                                        city: "",
                                        state: "",
                                        zipCode: "",
                                        country: "India",
                                        isDefault: false,
                                        addressType: "shipTo",
                                },
				isAddingNewAddress: false,

				// Order Summary
                                orderSummary: {
                                        items: [],
                                        subtotal: 0,
                                        shippingCost: 0,
                                        discount: 0,
                                        tax: 0,
                                        gst: { cgst: 0, sgst: 0, igst: 0 },
                                        total: 0,
                                },

				// Applied Coupon (only for buyNow flow)
				appliedCoupon: null,
				cartAppliedCoupon: null, // For cart flow

				// UI State
				isLoading: false,
				paymentLoading: false,
				currentStep: 1, // 1: Address, 2: Payment
				paymentMethod: "razorpay", // "razorpay", "cod", "credit_card","debit_card", "net_banking", "upi", "wallet"

				// Actions
				setCheckoutType: (type, product = null, quantity = 1) => {
					set({
						checkoutType: type,
						buyNowProduct: product,
						buyNowQuantity: quantity,
						currentStep: 1,
					});
				},

				setCustomerInfo: (info) => {
					set((state) => ({
						customerInfo: { ...state.customerInfo, ...info },
					}));
				},

				setCurrentStep: (step) => {
					set({ currentStep: step });
				},

				setPaymentMethod: (method) => {
					set({ paymentMethod: method });
				},

				// Initialize checkout data
				initializeCheckout: (
					cartItems = [],
					product = null,
					quantity = 1,
					cartCoupon = null
				) => {
					const { checkoutType } = get();

					let items = [];

					if (checkoutType === "buyNow" && product) {
						items = [
							{
								productId: product.id,
								productName: product.name || product.title,
                                                                productImage: product.mainImageLink || product.image,
								quantity: quantity,
								price: product.price,
								totalPrice: product.price * quantity,
							},
						];
					} else {
						items = cartItems.map((item) => ({
							productId: item.id,
							productName: item.name,
							productImage: item.image,
							quantity: item.quantity,
							price: item.price,
							totalPrice: item.price * item.quantity,
						}));
					}

					const subtotal = items.reduce(
						(sum, item) => sum + item.totalPrice,
						0
					);

                                        // Shipping is free for all orders
                                        const shippingCost = 0;

					// Set coupon based on checkout type
					let discount = 0;
					if (checkoutType === "cart" && cartCoupon) {
						set({ cartAppliedCoupon: cartCoupon });
						discount =
							cartCoupon.discountAmount ||
							(subtotal * cartCoupon.discount) / 100;
					} else if (checkoutType === "buyNow") {
						const appliedCoupon = get().appliedCoupon;
						discount = appliedCoupon?.discountAmount || 0;
					}

                                        set({
                                                orderSummary: {
                                                        items,
                                                        subtotal,
                                                        shippingCost,
                                                        discount,
                                                        tax: 0,
                                                        gst: { cgst: 0, sgst: 0, igst: 0 },
                                                        total: 0,
                                                },
                                        });
                                        get().recalculateTotal();
                                },

				// Load user addresses
                                loadUserAddresses: async () => {
                                        set({ isLoading: true });
                                        try {
                                                const data = await paymentAPI.getUserAddresses();
                                                if (data.success) {
                                                        const billing = data.addresses.find(
                                                                (addr) => addr.addressType === "billTo"
                                                        );
                                                        const shipping = data.addresses.filter(
                                                                (addr) => addr.addressType === "shipTo"
                                                        );

                                                        set({
                                                                savedAddresses: shipping,
                                                                billingAddress: billing || null,
                                                        });

                                                        // Auto-select default shipping address if available
                                                        const defaultAddress = shipping.find(
                                                                (addr) => addr.isDefault
                                                        );
                                                        if (defaultAddress) {
                                                                set({ selectedAddressId: defaultAddress._id });
                                                        }

                                                        // Recalculate totals to apply correct GST
                                                        get().recalculateTotal();
                                                }
                                        } catch (error) {
                                                console.error("Failed to load addresses:", error);
                                                toast.error("Failed to load saved addresses");
                                        } finally {
                                                set({ isLoading: false });
                                        }
                                },

				// Add new address
				addNewAddress: async () => {
					const { newAddress } = get();

					if (
						!newAddress.name ||
						!newAddress.street ||
						!newAddress.city ||
						!newAddress.state ||
						!newAddress.zipCode
					) {
						toast.error("Please fill all address fields");
						return false;
					}

					set({ isLoading: true });
					try {
                                                const data = await paymentAPI.addUserAddress(newAddress);
						if (data.success) {
							// Reload addresses
							await get().loadUserAddresses();

							// Reset new address form
							set({
                                                                newAddress: {
                                                                        tag: "home",
                                                                        name: "",
                                                                        street: "",
                                                                        city: "",
                                                                        state: "",
                                                                        zipCode: "",
                                                                        country: "India",
                                                                        isDefault: false,
                                                                        addressType: "shipTo",
                                                                },
								isAddingNewAddress: false,
							});

							toast.success("Address added successfully");
							return true;
						}
					} catch (error) {
						console.error("Failed to add address:", error);
						toast.error(error.message || "Failed to add address");
					} finally {
						set({ isLoading: false });
					}
					return false;
				},

				// Update new address form
				updateNewAddress: (field, value) => {
					set((state) => ({
						newAddress: { ...state.newAddress, [field]: value },
					}));
				},

				// Select address
                                selectAddress: (addressId) => {
                                        set({ selectedAddressId: addressId });
                                        // Update totals when user changes address
                                        get().recalculateTotal();
                                },

				// Toggle add new address form
				toggleAddNewAddress: () => {
					set((state) => ({ isAddingNewAddress: !state.isAddingNewAddress }));
				},

				// Apply coupon (only for buyNow flow)
				applyCoupon: async (couponCode) => {
					const { checkoutType } = get();

					if (checkoutType === "cart") {
						toast.error("Coupon is already applied from cart");
						return false;
					}

					set({ isLoading: true });

					try {
						const data = await paymentAPI.validateCoupon(
							couponCode,
							get().orderSummary.subtotal
						);

						if (data.success) {
							set({ appliedCoupon: data.coupon });
							get().recalculateTotal();
							toast.success("Coupon applied successfully!");
							return true;
						} else {
							toast.error(data.message || "Invalid coupon code");
							return false;
						}
					} catch (error) {
						toast.error(error.message || "Failed to apply coupon");
						return false;
					} finally {
						set({ isLoading: false });
					}
				},

				// Remove coupon (only for buyNow flow)
				removeCoupon: () => {
					const { checkoutType } = get();

					if (checkoutType === "cart") {
						toast.error("Cannot remove coupon applied from cart");
						return;
					}

					set({ appliedCoupon: null });
					get().recalculateTotal();
					toast.success("Coupon removed");
				},

				// Recalculate total
                                recalculateTotal: () => {
                                        const {
                                                orderSummary,
                                                appliedCoupon,
                                                cartAppliedCoupon,
                                                checkoutType,
                                                savedAddresses,
                                                selectedAddressId,
                                        } = get();

                                        // Shipping is free for all orders
                                        const shippingCost = 0;

					// Calculate discount based on checkout type
					let discount = 0;
					if (checkoutType === "cart" && cartAppliedCoupon) {
						discount =
							cartAppliedCoupon.discountAmount ||
							(orderSummary.subtotal * cartAppliedCoupon.discount) / 100;
					} else if (checkoutType === "buyNow" && appliedCoupon) {
						discount =
							appliedCoupon.discountAmount ||
							(orderSummary.subtotal * appliedCoupon.discount) / 100;
					}

                                        // GST calculation
                                        const storeState =
                                                process.env.NEXT_PUBLIC_STORE_STATE || "Karnataka";
                                        const selectedAddress = savedAddresses.find(
                                                (addr) => addr._id === selectedAddressId
                                        );
                                        let cgst = 0;
                                        let sgst = 0;
                                        let igst = 0;
                                        if (orderSummary.subtotal > 0) {
                                                if (
                                                        selectedAddress &&
                                                        selectedAddress.state === storeState
                                                ) {
                                                        cgst = orderSummary.subtotal * 0.09;
                                                        sgst = orderSummary.subtotal * 0.09;
                                                } else {
                                                        igst = orderSummary.subtotal * 0.18;
                                                }
                                        }
                                        const tax = cgst + sgst + igst;

                                        const total =
                                                orderSummary.subtotal +
                                                tax -
                                                discount;

                                        set({
                                                orderSummary: {
                                                        ...orderSummary,
                                                        shippingCost,
                                                        discount,
                                                        tax,
                                                        gst: { cgst, sgst, igst },
                                                        total,
                                                },
                                        });
                                },

				// Get selected address
				getSelectedAddress: () => {
					const { savedAddresses, selectedAddressId } = get();
					return savedAddresses.find((addr) => addr._id === selectedAddressId);
				},

				// Process payment
				processPayment: async (userId, clearCartCallback = null) => {
					const {
						customerInfo,
						orderSummary,
						appliedCoupon,
						cartAppliedCoupon,
						checkoutType,
						paymentMethod,
					} = get();

					const selectedAddress = get().getSelectedAddress();

                                        if (!selectedAddress) {
                                                toast.error("Please select a ship to address");
                                                return { success: false, error: "No ship to address selected" };
                                        }

					if (orderSummary.items.length === 0) {
						toast.error("No items to checkout");
						return { success: false, error: "No items to checkout" };
					}

					set({ paymentLoading: true });

					try {
						// Determine which coupon to use
						const couponToUse =
							checkoutType === "cart" ? cartAppliedCoupon : appliedCoupon;

                                                // Prepare order data
                                                const defaultBilling =

                                                        get().billingAddress ||

                                                        get().savedAddresses.find((addr) => addr.isDefault) ||
                                                        selectedAddress;

                                                const formatAddress = (addr) => ({
                                                        tag: addr.tag,
                                                        name: addr.name,
                                                        street: addr.street,
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zipCode: addr.zipCode,
                                                        country: addr.country,
                                                        fullAddress: `${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}`,
                                                });

                                                const orderData = {
                                                        userId: userId,
                                                        customerName: customerInfo.name,
                                                        customerEmail: customerInfo.email,
                                                        customerMobile: customerInfo.mobile,
                                                        products: orderSummary.items,
                                                        subtotal: orderSummary.subtotal,
                                                        shippingCost: orderSummary.shippingCost,
                                                        discount: orderSummary.discount,
                                                        tax: orderSummary.tax,
                                                        gst: orderSummary.gst,
                                                        totalAmount: orderSummary.total,
                                                        paymentMethod: paymentMethod,
                                                        billToAddress: formatAddress(defaultBilling),
                                                        shipToAddress: formatAddress(selectedAddress),
                                                        couponApplied: couponToUse
                                                                ? {
                                                                                couponCode: couponToUse.code,
                                                                                discountAmount:
                                                                                        couponToUse.discountAmount || orderSummary.discount,
                                                                                discountType: "percentage",
                                                                  }
                                                                : null,
                                                };

						if (paymentMethod === "razorpay") {
							// Create Razorpay order
							const razorpayOrder = await paymentAPI.createRazorpayOrder({
								amount: orderSummary.total,
								currency: "INR",
								receipt: `order_${Date.now()}`,
							});

							// Initialize Razorpay payment
							const options = {
								key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
								amount: razorpayOrder.amount,
								currency: razorpayOrder.currency,
								name: "Your Store Name",
								description: "Purchase from Your Store",
								order_id: razorpayOrder.id,
								handler: async function (response) {
									try {
										// Verify payment
										const verificationData = {
											// razorpay_order_id: response.razorpay_order_id,
											razorpay_payment_id: response.razorpay_payment_id,
											// razorpay_signature: response.razorpay_signature,
											orderData,
											userId: userId,
											clearCart: checkoutType === "cart",
										};

										const verificationResult = await paymentAPI.verifyPayment(
											verificationData
										);

										if (verificationResult.success) {
											// Clear cart if it was a cart checkout
											if (checkoutType === "cart" && clearCartCallback) {
												clearCartCallback();
											}

											// Reset checkout
											get().resetCheckout();

                                                                                        toast.success("Order placed successfully!");

                                                                                        // Show confirmation then redirect to orders page
                                                                                        setTimeout(() => {
                                                                                                window.location.href = "/account/orders";
                                                                                        }, 2000);
										} else {
											toast.error("Payment verification failed");
										}
									} catch (error) {
										console.error("Payment verification error:", error);
										toast.error("Payment verification failed");
									} finally {
										set({ paymentLoading: false });
									}
								},
								prefill: {
									name: customerInfo.name,
									email: customerInfo.email,
									contact: customerInfo.mobile,
								},
								theme: {
									color: "#000000",
								},
								modal: {
									ondismiss: function () {
										set({ paymentLoading: false });
										toast.error("Payment cancelled");
									},
								},
							};

							const razorpay = new window.Razorpay(options);
							razorpay.open();

							return { success: true, paymentMethod: "razorpay" };
						} else if (paymentMethod === "cod") {
							// Handle Cash on Delivery
							const codOrderData = {
								orderData: {
									...orderData,
									paymentStatus: "pending",
									status: "confirmed",
								},
								userId: userId,
								clearCart: checkoutType === "cart",
							};

							const result = await paymentAPI.createOrder(codOrderData);

							if (result.success) {
								// Clear cart if it was a cart checkout
								if (checkoutType === "cart" && clearCartCallback) {
									clearCartCallback();
								}

								// Reset checkout
								get().resetCheckout();

                                                                toast.success("Order placed successfully!");

                                                                // Show confirmation then redirect to orders page
                                                                setTimeout(() => {
                                                                        window.location.href = "/account/orders";
                                                                }, 2000);

								return { success: true, paymentMethod: "cod" };
							} else {
								toast.error("Failed to place order");
								return { success: false, error: result.error };
							}
						}
					} catch (error) {
						console.error("Payment processing error:", error);
						toast.error("Payment processing failed");
						return { success: false, error: error.message };
					} finally {
						set({ paymentLoading: false });
					}
				},

				// Reset checkout
				resetCheckout: () => {
					set({
						checkoutType: "cart",
						buyNowProduct: null,
						buyNowQuantity: 1,
						customerInfo: { name: "", email: "", mobile: "" },
						savedAddresses: [],
						selectedAddressId: null,
						newAddress: {
							tag: "home",
							name: "",
							street: "",
							city: "",
							state: "",
							zipCode: "",
							country: "India",
							isDefault: false,
						},
						isAddingNewAddress: false,
                                                orderSummary: {
                                                        items: [],
                                                        subtotal: 0,
                                                        shippingCost: 0,
                                                        discount: 0,
                                                        tax: 0,
                                                        gst: { cgst: 0, sgst: 0, igst: 0 },
                                                        total: 0,
                                                },
						appliedCoupon: null,
						cartAppliedCoupon: null,
						currentStep: 1,
						paymentMethod: "razorpay",
						paymentLoading: false,
					});
				},

				// Validate checkout data
				validateCheckoutData: () => {
					const { customerInfo, selectedAddressId, orderSummary } = get();
					const errors = [];

					// Validate customer info
					if (!customerInfo.name.trim())
						errors.push("Customer name is required");
					if (!customerInfo.email.trim()) errors.push("Email is required");
					if (!customerInfo.mobile.trim())
						errors.push("Mobile number is required");

                                        // Validate ship to address
                                        if (!selectedAddressId)
                                                errors.push("Please select a ship to address");

					// Validate order items
					if (orderSummary.items.length === 0) errors.push("No items in order");

					return {
						isValid: errors.length === 0,
						errors,
					};
				},

				// Get checkout summary
				getCheckoutSummary: () => {
					const {
						orderSummary,
						appliedCoupon,
						cartAppliedCoupon,
						paymentMethod,
						checkoutType,
					} = get();
					const couponToUse =
						checkoutType === "cart" ? cartAppliedCoupon : appliedCoupon;

					return {
						itemCount: orderSummary.items.reduce(
							(sum, item) => sum + item.quantity,
							0
						),
						uniqueItems: orderSummary.items.length,
						...orderSummary,
						hasPromo: !!couponToUse,
						promoCode: couponToUse?.code,
						paymentMethod,
						checkoutType,
					};
				},
			}),
			{
				name: "checkout-storage",
				partialize: (state) => ({
					paymentMethod: state.paymentMethod,
				}),
			}
		)
	)
);
