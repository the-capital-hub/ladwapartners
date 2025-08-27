"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminKycPage() {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKycs();
  }, []);

  async function fetchKycs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/kyc");
      if (res.ok) {
        const data = await res.json();
        setKycs(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    let remark = "";
    if (status === "rejected") {
      remark = prompt("Reason for rejection?") || "";
    }
    const res = await fetch(`/api/admin/kyc/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remark }),
    });
    if (res.ok) {
      fetchKycs();
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-600">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kycs.map((k) => (
                  <TableRow key={k._id}>
                    <TableCell>{k.user?.email}</TableCell>
                    <TableCell>{k.gstin}</TableCell>
                    <TableCell className="capitalize">{k.status}</TableCell>
                    <TableCell>
                      {k.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => updateStatus(k._id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(k._id, "rejected")}>Reject</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {kycs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No KYC requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
