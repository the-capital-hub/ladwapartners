"use client";

import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Barcode, AppStore, GooglePlay } from "@/public/images/home/index.js";
import Logo from "@/public/ladwapartners.png";

export default function Footer() {
        const footerSections = {
                support: {
                        title: "Support",
                        items: ["hello@ladwapartners.com", "9945234161"],
                },
                account: {
                        title: "Account",
                        items: ["My Account", "Login / Register", "Cart", "Wishlist", "Shop"],
                },
        };

	return (
		<footer className="bg-black text-white py-8 md:py-16">
			<div className="px-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {/* Logo & About */}
                                        <div className="lg:col-span-1 space-y-4">
                                                <Image
                                                        src={Logo}
                                                        alt="Ladwa Partners Logo"
                                                        width={150}
                                                        className="object-contain"
                                                />
                                                <p className="text-gray-400 text-sm">
                                                        Ladwa Partners connects suppliers and buyers for safety products across India.
                                                </p>
                                        </div>

					{/* Support */}
					<div>
						<h3 className="text-xl font-bold mb-4">
							{footerSections.support.title}
						</h3>
						<div className="space-y-3 text-gray-400">
							{footerSections.support.items.map((item, index) => (
								<p
									key={index}
									className="hover:text-white cursor-pointer transition-colors"
								>
									{item}
								</p>
							))}
						</div>
					</div>

					{/* Account */}
					<div>
						<h3 className="text-xl font-bold mb-4">
							{footerSections.account.title}
						</h3>
						<div className="space-y-3 text-gray-400">
							{footerSections.account.items.map((item, index) => (
								<p
									key={index}
									className="hover:text-white cursor-pointer transition-colors"
								>
									{item}
								</p>
							))}
						</div>
					</div>

					{/* Download App */}
					<div>
						<h3 className="text-xl font-bold mb-4">Download App</h3>
						{/* <p className="text-gray-400 mb-4">Save $3 with App New User Only</p> */}
						<div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-4 xl:space-y-0 xl:space-x-4 mb-6">
							<Image
								src={Barcode}
								alt="Google Play"
								width={88}
								height={88}
								className="w-[88px] h-[88px] object-cover flex-shrink-0"
							/>
							<div className="space-y-2">
								<Image
									src={GooglePlay}
									alt="Google Play"
									width={128}
									height={40}
									className="w-32 h-10 object-cover border rounded-lg cursor-pointer"
								/>
								<Image
									src={AppStore}
									alt="App Store"
									width={128}
									height={40}
									className="w-32 h-10 object-cover border rounded-lg cursor-pointer"
								/>
							</div>
						</div>
						<div className="flex space-x-4">
							<Facebook className="h-6 w-6 hover:text-blue-400 cursor-pointer transition-colors" />
							<Instagram className="h-6 w-6 hover:text-pink-400 cursor-pointer transition-colors" />
							<Linkedin className="h-6 w-6 hover:text-blue-600 cursor-pointer transition-colors" />
						</div>
					</div>
				</div>

				<div className="border-t border-white/20 mt-8 md:mt-12 pt-8 text-center text-gray-400">
					<p>© Copyright LADWA Group 2022. All right reserved</p>
				</div>
			</div>
		</footer>
	);
}
