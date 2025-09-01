export const metadata = {
  title: "Cancellation & Refund Policy | LADWA Partners",
  description: "Guidelines on order cancellations and refunds for purchases made on LADWA Partners."
};

export default function CancellationRefundPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Cancellation & Refund Policy</h1>
      <p>
        Orders can be cancelled within 24 hours of placement, provided they have
        not yet been dispatched. To request a cancellation, contact our support
        team with your order details.
      </p>
      <p>
        Refunds are processed to the original payment method within 7 working
        days after the returned items are received and inspected. Shipping
        charges are non-refundable unless the return is due to a defect or error
        on our part.
      </p>
    </main>
  );
}

