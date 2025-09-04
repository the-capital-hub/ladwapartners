import Header from "@/components/BuyerPanel/Header";
import Footer from "@/components/BuyerPanel/Footer";

export default function FooterPagesLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showMenu={false} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
