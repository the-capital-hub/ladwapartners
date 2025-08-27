import mongoose from "mongoose";

const UserKYCSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    gstin: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminRemark: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.UserKYC || mongoose.model("UserKYC", UserKYCSchema);
