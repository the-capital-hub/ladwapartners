import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import UserGST from "@/model/UserGST.js";

export async function GET(request, { params }) {
        try {
                await dbConnect();
                const record = await UserGST.findOne({ user: params.id });
                if (!record) {
                        return NextResponse.json(
                                { success: false, error: "GST details not found" },
                                { status: 404 }
                        );
                }
                return NextResponse.json({ success: true, data: record.details });
        } catch (error) {
                return NextResponse.json(
                        { success: false, error: error.message },
                        { status: 500 }
                );
        }
}
