import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
