"use client";

import { motion } from "framer-motion";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-hot-toast";

export function LogoutPopup({ open, onOpenChange }) {
        const router = useRouter();
        const clearUser = useAuthStore((state) => state.clearUser);

        const handleLogout = async () => {
                try {
                        await fetch("/api/auth/logout", { method: "POST" });
                        clearUser();
                        toast.success("Logged out");
                        router.push("/login");
                } catch (error) {
                        console.error("Logout error:", error);
                        toast.error("Failed to logout");
                } finally {
                        onOpenChange(false);
                }
        };

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader className="text-center">
						<div className="mx-auto mb-4 w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
							<div className="text-4xl">👋</div>
						</div>
						<DialogTitle className="text-xl font-semibold">
							Are You Trying Logging Out ?
						</DialogTitle>
						{/* <DialogDescription className="text-gray-600">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore
						</DialogDescription> */}
					</DialogHeader>
					<DialogFooter className="flex gap-3 mt-6">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							onClick={handleLogout}
							className="flex-1 bg-orange-500 hover:bg-orange-600"
						>
							Yes Logout
						</Button>
					</DialogFooter>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
