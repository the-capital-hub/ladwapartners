"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react"; // icons
import { toast } from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent successfully");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-gray-500 mt-2">Need Assistance? We're here to help.</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {/* Left - Contact Info */}
        <div className="bg-teal-600 text-white p-8 md:col-span-1">
          <h2 className="text-xl font-bold mb-2">Contact Information</h2>
          <p className="mb-6 text-sm opacity-90">Say something to start a live chat!</p>

          <div className="flex items-center gap-3 mb-4">
            <Phone size={18} />
            <span>+91 8971815400</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Mail size={18} />
            <span>contact@ladwapartners.com</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-1" />
            <span className="text-sm leading-relaxed">
              Ladwa Partners <br />
              Beside St. Anne&apos;s Church, Mestrhi Palya, Rachenahalli, <br />
              Thanisandra, Bengaluru, KA 560077
            </span>
          </div>
        </div>

        {/* Right - Form */}
        <div className="col-span-2 p-8">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-teal-500 outline-none py-2"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-teal-500 outline-none py-2"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-teal-500 outline-none py-2"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-teal-500 outline-none py-2"
                placeholder="Phone Number"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Message</label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-teal-500 outline-none py-2"
                placeholder="Write your message..."
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-teal-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-teal-700 transition disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
