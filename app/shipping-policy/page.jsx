export const metadata = {
  title: "Shipping Policy | LADWA Partners",
  description: "Information on shipping methods, timelines, and charges for orders placed on LADWA Partners."
};

export default function ShippingPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Shipping Policy</h1>
      <p>
        We ship orders across India using trusted logistics partners. Orders are
        typically processed within 2 working days and delivered within 3-7
        business days depending on the destination. Tracking information will be
        provided once the order is dispatched.
      </p>
      <p>
        Shipping charges are calculated at checkout based on order weight and
        destination. Free shipping promotions, if available, will be clearly
        indicated. Currently, we do not support international shipping.
      </p>
    </main>
  );
}

