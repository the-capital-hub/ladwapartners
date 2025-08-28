"use client";

import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "@/public/ladwapartners.png";

export default function Footer() {
	const footerSections = {
		support: {
			title: "Support",
			items: ["sales@ladwaspartner.com", "+91 9945234161"],
		},
		account: {
			title: "Account",
			items: ["My Account", "Login / Register", "Cart", "Wishlist", "Shop"],
		},
		quickLinks: {
			title: "Quick Link",
			items: ["Privacy Policy", "Terms Of Use", "FAQ", "Contact Us"],
		},
	};

	return (
		<footer className="bg-black text-white py-8 md:py-16">
			<div className="px-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                       {/* Logo and About */}
                                       <div>
                                               <Image
                                                       src={Logo}
                                                       alt="LADWA Partners"
                                                       width={150}
                                                       height={40}
                                                       className="mb-4"
                                               />
                                               <p className="text-gray-400 mb-6">
                                                       LADWA Partners offers high-quality safety products ensuring road
                                                       protection everywhere.
                                               </p>
                                               <div className="flex space-x-4">
                                                       <Facebook className="h-6 w-6 hover:text-blue-400 cursor-pointer transition-colors" />
                                                       <Instagram className="h-6 w-6 hover:text-pink-400 cursor-pointer transition-colors" />
                                                       <Linkedin className="h-6 w-6 hover:text-blue-600 cursor-pointer transition-colors" />
                                               </div>
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

                                       {/* Quick Links */}
                                       <div>
                                               <h3 className="text-xl font-bold mb-4">
                                                       {footerSections.quickLinks.title}
                                               </h3>
                                               <div className="space-y-3 text-gray-400">
                                                       {footerSections.quickLinks.items.map((item, index) => (
                                                               <p
                                                                       key={index}
                                                                       className="hover:text-white cursor-pointer transition-colors"
                                                               >
                                                                       {item}
                                                               </p>
                                                       ))}
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
