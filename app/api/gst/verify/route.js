import { verifyGSTIN } from "@/lib/gst";

export async function POST(req) {
        const { gstin } = await req.json();
        if (!gstin) {
                return Response.json({ message: "GSTIN required" }, { status: 400 });
        }
        try {
                const data = await verifyGSTIN(gstin);
                return Response.json(data);
        } catch (err) {
                return Response.json(
                        { message: err.message || "GST verification failed" },
                        { status: 400 }
                );
        }
}
