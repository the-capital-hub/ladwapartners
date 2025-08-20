import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User.js";
import Verification from "@/model/Verification.js";
import {
        verifyGSTIN,
        lookupGSTINFromPAN,
        check206AB,
        namesMatch,
} from "@/lib/gst";

export async function POST(req) {
        await dbConnect();
        const {
                email,
                mobile,
                password,
                firstName,
                lastName,
                legalName,
                tradeName,
                pan,
                gstin,
                termsAccepted,
        } = await req.json();

        if ((!email && !mobile) || !password) {
                return Response.json(
                        { message: "Email or mobile and password required" },
                        { status: 400 }
                );
        }

        if (!termsAccepted) {
                return Response.json(
                        { message: "Terms must be accepted" },
                        { status: 400 }
                );
        }

        const existingUser = await User.findOne({
                $or: [{ email }, { mobile }],
        });

        if (existingUser) {
                return Response.json({ message: "User already exists" }, { status: 409 });
        }

        if (email) {
                const verification = await Verification.findOne({ email });

                if (!verification) {
                        return Response.json({ message: "Email not verified" }, { status: 403 });
                }
        }

        let gstInfo = null;
        let status = "PENDING";
        let verified = false;
        const compliance = {};
        let selectedGstin = gstin;

        try {
                if (selectedGstin) {
                        gstInfo = await verifyGSTIN(selectedGstin);
                } else if (pan) {
                        const lookup = await lookupGSTINFromPAN(pan);
                        const active = lookup?.gstins?.filter(
                                (g) => g.status === "Active"
                        );
                        if (active && active.length === 1) {
                                selectedGstin = active[0].gstin;
                                gstInfo = await verifyGSTIN(selectedGstin);
                        } else if (active && active.length > 1) {
                                gstInfo = { options: active };
                                status = "PENDING";
                        } else {
                                status = "REJECTED";
                        }
                }

                if (gstInfo && gstInfo.status) {
                        if (
                                gstInfo.status === "Active" &&
                                (!pan || gstInfo.pan === pan) &&
                                namesMatch(gstInfo.legalName, legalName) &&
                                namesMatch(gstInfo.tradeName, tradeName)
                        ) {
                                verified = true;
                                status = "APPROVED";
                                if (pan) {
                                        const ab = await check206AB(pan);
                                        if (ab) compliance["206AB"] = ab;
                                }
                        } else {
                                status = "REJECTED";
                        }
                }
        } catch (err) {
                return Response.json(
                        { message: "GST verification failed", error: err.message },
                        { status: 502 }
                );
        }

        const lastLogin = Date.now();

        const newUser = new User({
                email,
                mobile,
                password,
                firstName,
                lastName,
                legalName,
                tradeName,
                pan,
                gstin: selectedGstin,
                gstStatus: gstInfo?.status,
                gstType: gstInfo?.type,
                gstStateCode: gstInfo?.stateCode,
                gstLastFiling: gstInfo?.lastFiling,
                gstVerified: verified,
                gstVerificationStatus: status,
                complianceFlags: compliance,
                termsAccepted,
                lastLogin,
                isVerified: true,
        });
        await newUser.save();

        return Response.json({
                dealerId: newUser._id,
                status,
                gst: {
                        gstin: newUser.gstin,
                        status: newUser.gstStatus,
                        type: newUser.gstType,
                        stateCode: newUser.gstStateCode,
                        legalName: newUser.legalName,
                        tradeName: newUser.tradeName,
                        lastFiling: newUser.gstLastFiling,
                },
                complianceFlags: compliance,
        });
}
