export const metadata = {
  title: "Pricing Policy | LADWA Partners",
  description: "Learn how LADWA Partners sets and updates product prices on our platform."
};

export default function PricingPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Pricing Policy</h1>
      <p>
        Prices for all products listed on LADWA Partners are displayed in Indian
        Rupees (INR) and include applicable taxes unless stated otherwise. We
        make every effort to provide accurate pricing, but prices may change
        without prior notice due to market fluctuations or supplier updates.
      </p>
      <p>
        Promotional prices and discounts are valid only for the duration of the
        offer and cannot be combined with other promotions unless explicitly
        mentioned. In the event of a pricing error, we reserve the right to
        cancel orders placed at the incorrect price and will notify affected
        customers promptly.
      </p>
    </main>
  );
}

