export const metadata = {
  title: "Shipping Information | LADWA Partners",
  description: "Details on shipping charges, pickup options, and international delivery for LADWA Partners orders.",
};

export default function ShippingInformationPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">LADWA Shipping &amp; Handling Charges</h1>

      <section id="free-delivery" className="space-y-2">
        <h2 className="text-xl font-semibold">Do you offer Free Delivery?</h2>
        <p>
          LADWA offers standard Free Delivery for online orders over Rs.50,000.00
          (excl. GST)*
        </p>
        <p>
          If your order online contains Heavy/Bulky Items or Bulk quantities
          (like Cones, Barriers and barricade, Speed breakers, Convex mirrors,
          etc) additional delivery/freight charge applies which our team will
          connect and discuss
        </p>
        <p>
          Some regional/geographically remote locations may incur additional
          freight charges.
        </p>
        <p>We cannot deliver to PO Box Address or Parcel Lockers.</p>
      </section>

      <section id="heavy-bulky" className="space-y-2">
        <h2 className="text-xl font-semibold">Heavy/Bulky Items</h2>
        <p>
          Freight charges may apply for heavy and/or bulky items. Some bulk
          quantity purchases are excluded from free delivery.
        </p>
        <p>
          Items that are classified as Heavy/Bulky may have extra freight charges
          apply. If your order online contains Heavy/Bulky Items or Bulk
          quantities additional delivery/freight charge applies upon completion
          (customer service representative will contact you). Call +91 63660
          97631 for any enquiries.
        </p>
        <p>
          <strong>Note:</strong> Some regional &amp; geographically remote locations
          may incur additional charges once order is booked with the courier. We
          will advise if required to obtain acceptance and approval to proceed.
        </p>
        <p>
          Any promotions that offer free delivery or delivery discounts do not
          apply to heavy or bulky items. If you are unsure, please call LADWA for
          confirmation.
        </p>
      </section>

      <section id="order-pickup" className="space-y-2">
        <h2 className="text-xl font-semibold">Order Pick Up</h2>
        <ul className="list-disc pl-6">
          <li>Bangalore, Karnataka</li>
          <li>Bhiwandi Mumbai - Maharastra</li>
          <li>Sonepat - Delhi/Harayana</li>
          <li>Gudwathi - Assam / WB</li>
        </ul>
        <p>
          <strong>Booking required:</strong> Call +91 63660 97631 to book a time
          for pickup.
        </p>
        <p>Pick up booking times availability: Monday - Friday, 9am - 2:30pm</p>
        <address className="not-italic">
          <div>Ladwa Solutions Inc</div>
          <div>NO. 3,4 AND 9, Khata No. 37/1,</div>
          <div>Singasandra Village, Begur Hobli,</div>
          <div>Bengaluru- 560 068</div>
          <div>BHARATH.</div>
        </address>
        <p>Closed on Public Holidays</p>
      </section>

      <section id="standard-cost" className="space-y-2">
        <h2 className="text-xl font-semibold">Standard Cost of Delivery</h2>
        <p>
          Standard shipping cost for each order value price bracket. When
          delivery charges apply: shipping and handling is based on order value.
          Prices quoted are EXCL of GST.
        </p>
        <p>
          Please note this is for standard products only. Items that are
          classified as Heavy/Bulky may have extra freight charges apply. We only
          ship orders to destinations within INDIA.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Order Value
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Shipping &amp; Handling Cost (sent via Road Cargo services like
                  VRL, GATI, etc)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Upto Rs.50,000.00
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  8% of the order value
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Above Rs.50,001 or more
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Rs.0.00 (Excluding bulk and heavy)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="shipping-options" className="space-y-2">
        <h2 className="text-xl font-semibold">Shipping Options</h2>
        <p>
          Products under 5kg in weight are sent via DELHIVERY / HEXALOG etc
          services. These goods will arrive the next business day to most metro
          locations in India.
        </p>
        <p>
          For in stock items, orders received and processed by us before 4pm each
          business day will be dispatched the next day.
        </p>
        <p>
          International Orders: We can deliver orders outside of India. Customers
          must organise their carriers and prepay the order. Call our team on +91
          9945234161 for details.
        </p>
      </section>
    </main>
  );
}

