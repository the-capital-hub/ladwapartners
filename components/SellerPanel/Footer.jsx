import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/public/images/home/index.js";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
	const footerSections = {
		support: {
			title: "Support",
			links: [
				{ label: "help@ladwapartners.com", href: "mailto:help@ladwapartners.com" },
				{ label: "9945234161", href: "#" },
			],
		},
		account: {
			title: "Account",
			links: [
				{ label: "My Account", href: "/account" },
				{ label: "Login / Register", href: "/auth" },
				{ label: "Cart", href: "/cart" },
				{ label: "Wishlist", href: "/wishlist" },
				{ label: "Shop", href: "/shop" },
			],
		},
		quickLinks: {
			title: "Quick Link",
			links: [
				{ label: "Privacy Policy", href: "/privacy" },
				{ label: "Terms Of Use", href: "/terms" },
				{ label: "FAQ", href: "/faq" },
				{ label: "Contact", href: "/contact" },
			],
		},
	};

	return (
		<footer className="bg-[#211F1D] text-white">
			{/* Newsletter Section */}
			<div className="bg-neutral-200 text-black py-12">
				<div className="px-10 text-center">
					<h3 className="text-2xl font-bold mb-4">
						Start Selling Safety Today
					</h3>
					<p className="mb-8">
						Join hundreds of verified suppliers already reaching India's top
						buyers.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-3 rounded-full font-medium">
							Register as Seller
						</button>
						<button className="border border-black bg-black text-white px-6 py-3 rounded-full font-medium">
							Talk to Sales Support
						</button>
						<button className="border border-black px-6 py-3 rounded-full font-medium">
							Download Seller Guide PDF
						</button>
					</div>
				</div>
			</div>

			{/* Main Footer */}
			<div className="py-12">
                                <div className="px-10">
                                        <div className="grid grid-cols-1 md:grid-cols-4">
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

                                                {/* Footer Links */}
                                                {Object.entries(footerSections).map(([key, section]) => (
                                                        <div key={key}>
                                                                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                                                                <ul className="space-y-2">
                                                                        {section.links.map((link, index) => (
                                                                                <li key={index}>
                                                                                        <Link
                                                                                                href={link.href}
                                                                                                className="hover:text-gray-400 transition-colors duration-200"
                                                                                        >
                                                                                                {link.label}
                                                                                        </Link>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
                                                ))}
                                        </div>
                                        
                                        {/* Copyright */}
                                        <div className="border-t border-white/20 mt-12 pt-8 text-center">
                                                <p className="font-semibold tracking-widexwhite">
                                                        © Copyright LADWA Partners 2025. All rights reserved
                                                </p>
                                        </div>
                                </div>
                        </div>
		</footer>
	);
}
