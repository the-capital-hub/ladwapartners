import mongoose from "mongoose";

const UserGSTSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    gstin: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.UserGST || mongoose.model("UserGST", UserGSTSchema);
