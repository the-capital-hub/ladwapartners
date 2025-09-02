import { Suspense } from "react";
import SellerHeader from "@/components/SellerPanel/Header.jsx";
import SellerFooter from "@/components/SellerPanel/Footer.jsx";
import LoadingSpinner from "@/components/SellerPanel/LoadingSpinner.jsx";
import { Toaster } from "react-hot-toast";

export default function SellerLayout({ children }) {
	return (
                <div className="min-h-screen">
			<Suspense fallback={<LoadingSpinner />}>
				<SellerHeader />
			</Suspense>

			<main className="relative">
				<Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
			</main>

                        <Suspense fallback={<LoadingSpinner />}>
                                <SellerFooter />
                        </Suspense>
                        <Toaster toastOptions={{ duration: 3000 }} />
                </div>
        );
}
