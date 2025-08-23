"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function GstDetailsPopup({ open, onOpenChange, customer }) {
        const [details, setDetails] = useState(null);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
                if (open && customer) {
                        setLoading(true);
                        fetch(`/api/admin/customers/${customer._id}/gst`)
                                .then((res) => res.json())
                                .then((data) => {
                                        if (data.success) setDetails(data.data);
                                })
                                .finally(() => setLoading(false));
                }
        }, [open, customer]);

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold">
                                                GST Details
                                        </DialogTitle>
                                </DialogHeader>
                                {loading && (
                                        <div className="py-8 text-center text-gray-600">
                                                Loading...
                                        </div>
                                )}
                                {!loading && details && (
                                        <div className="max-h-[60vh] overflow-y-auto pr-4">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="font-medium text-gray-600">GSTIN</div>
                                                        <div>{details?.basicDetails?.gstin}</div>
                                                        <div className="font-medium text-gray-600">Legal Name</div>
                                                        <div>{details?.basicDetails?.Legal_Name}</div>
                                                        <div className="font-medium text-gray-600">Trade Name</div>
                                                        <div>{details?.basicDetails?.tradeNam}</div>
                                                        <div className="font-medium text-gray-600">Status</div>
                                                        <div>{details?.basicDetails?.registrationStatus}</div>
                                                        <div className="font-medium text-gray-600">Type</div>
                                                        <div>{details?.basicDetails?.registrationType}</div>
                                                        <div className="font-medium text-gray-600">State Code</div>
                                                        <div>{details?.basicDetails?.gstin?.slice(0,2)}</div>
                                                        <div className="font-medium text-gray-600">Last Filing</div>
                                                        <div>{details?.filingDetails?.currentYear?.filingStatus?.[0]?.filingDate}</div>
                                                </div>
                                        </div>
                                )}
                                {!loading && !details && (
                                        <div className="py-8 text-center text-gray-600">
                                                No GST details available
                                        </div>
                                )}
                        </DialogContent>
                </Dialog>
        );
}
