import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema({
	mobile: { type: String, unique: true },
	code: String,
	expiresAt: Date,
});

export default mongoose.models.Verification ||
	mongoose.model("Verification", VerificationSchema);
