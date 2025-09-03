"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { AccountSidebar } from "@/components/BuyerPanel/account/AccountSidebar.jsx";

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 },
};

export default function AccountLayout({ children }) {
	const [activeTab, setActiveTab] = useState("my-profile");
	const [isClient, setIsClient] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (pathname && isClient) {
			const urlToTabMap = {
				"/account": "my-profile",
				"/account/profile": "my-profile",
				"/account/orders": "order-history",
				"/account/help": "help-center",
			};

			const matchedTab = urlToTabMap[pathname];
			if (matchedTab) {
				setActiveTab(matchedTab);
			}
		}
	}, [pathname, isClient]);

	if (!isClient) {
		return (
			<div className="h-[calc(100vh-68px)] bg-gray-50">
				{/* Skeleton sidebar */}
				<div className="hidden md:block fixed left-0 top-0 w-80 h-[calc(100vh-68px)] bg-white border-r border-gray-200">
					<div className="p-6">Loading...</div>
				</div>
				{/* Content */}
				<div className="md:ml-80">
					<div className="h-[calc(100vh-68px)] overflow-y-auto">
						<div className="p-8">{children}</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-[calc(100vh-68px)] bg-gray-50">
			<AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
			{/* Only apply left margin on md and above */}
			<div className="md:ml-72">
				<div className="h-[calc(100vh-68px)] overflow-y-auto hide-scrollbar">
					<motion.div className="p-8" {...fadeInUp}>
						{children}
					</motion.div>
				</div>
			</div>
		</div>
	);
}
