"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Package, User, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { LogoutPopup } from "@/components/Shared/Popups/LogoutPopup.jsx";

const sidebarItems = [
	{
		id: "my-profile",
		title: "My Profile",
		icon: User,
		description: "Personal information & addresses",
		href: "/account/profile",
	},
	{
		id: "order-history",
		title: "Order History",
		icon: Package,
		description: "View your past orders",
		href: "/account/orders",
	},
	{
		id: "help-center",
		title: "Help Center",
		icon: HelpCircle,
		description: "Get help & support",
		href: "/account/help",
	},
];

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: (i) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: i * 0.1,
			duration: 0.5,
		},
	}),
};

export function AccountSidebar({ activeTab, onTabChange }) {
	const router = useRouter();
	const pathname = usePathname();
	const [logoutOpen, setLogoutOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleTabClick = (item) => {
		onTabChange(item.id);
		router.push(item.href);
		setMobileOpen(false);
	};

	const isActive = (item) => {
		if (pathname === "/account" && item.id === "my-profile") {
			return true;
		}
		return pathname === item.href || activeTab === item.id;
	};

	const SidebarContent = () => (
		<div className="px-6 py-8 h-full flex flex-col justify-between bg-white">
			<nav className="space-y-2 flex-1">
				{sidebarItems.map((item, index) => (
					<motion.div
						key={item.id}
						custom={index}
						initial="hidden"
						animate="visible"
						variants={itemVariants}
					>
						<button
							onClick={() => handleTabClick(item)}
							className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${isActive(item)
									? "bg-yellow-50 border-l-4 border-l-yellow-600"
									: "hover:bg-gray-50"
								}`}
						>
							<div className="flex items-center gap-3 mb-1">
								<item.icon
									className={`h-5 w-5 transition-colors ${isActive(item)
											? "text-yellow-600"
											: "text-gray-500 group-hover:text-gray-700"
										}`}
								/>
								<span
									className={`font-medium transition-colors ${isActive(item)
											? "text-yellow-900"
											: "text-gray-900 group-hover:text-gray-900"
										}`}
								>
									{item.title}
								</span>
							</div>
							<p
								className={`text-sm ml-8 transition-colors ${isActive(item)
										? "text-yellow-700"
										: "text-gray-500 group-hover:text-gray-600"
									}`}
							>
								{item.description}
							</p>
						</button>
					</motion.div>
				))}
			</nav>
			<div className="p-6 border-t">
				<button
					onClick={() => setLogoutOpen(true)}
					className="w-full text-left p-4 rounded-lg transition-all duration-200 group hover:bg-gray-50"
				>
					<div className="flex items-center gap-3">
						<LogOut className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
						<span className="font-medium text-gray-900 group-hover:text-gray-900">
							Logout
						</span>
					</div>
				</button>
			</div>
		</div>
		
		
	);

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden md:block md:fixed md:left-0 md:top-[68px] md:w-72 md:h-[calc(100vh-68px)] bg-white md:overflow-y-auto md:z-10">
				<SidebarContent />
			</div>

			{/* Mobile Sidebar Toggle Button */}
			<button
				className="md:hidden fixed top-20  left-4 z-20 p-2 bg-white rounded-lg shadow"
				onClick={() => setMobileOpen(true)}
			>
				<Menu className="h-6 w-6 text-gray-700" />
			</button>

			{/* Mobile Sidebar with AnimatePresence */}
			<AnimatePresence>
				{mobileOpen && (
					<>
						{/* Sidebar */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ duration: 0.3 }}
							className="fixed top-0 left-0 w-72 h-full bg-white shadow-xl z-40"
						>
							<div className="flex justify-between items-center p-4 border-b">
								<h2 className="font-semibold text-lg">Account</h2>
								<button onClick={() => setMobileOpen(false)}>
									<X className="h-6 w-6 text-gray-700" />
								</button>
							</div>
							<SidebarContent />
						</motion.div>

						{/* Overlay Background */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 bg-black bg-opacity-40 z-30"
							onClick={() => setMobileOpen(false)}
						/>
					</>
				)}
			</AnimatePresence>

			<LogoutPopup open={logoutOpen} onOpenChange={setLogoutOpen} />
		</>
	);
}
