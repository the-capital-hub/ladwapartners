"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsAuthenticated } from "@/store/adminAuthStore.js";
import { useRouter } from "next/navigation";

export default function AdminContactUsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useIsAuthenticated();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/admin/login");
      }, 3);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/admin/contact-us");
        const data = await res.json();
        if (data.success) {
          setMessages(data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated && isRedirecting) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg._id}>
                <TableCell>{`${msg.firstName || ""} ${msg.lastName || ""}`}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.phone || "-"}</TableCell>
                <TableCell className="max-w-xs whitespace-pre-wrap break-words">{msg.message}</TableCell>
                <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {!loading && messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No messages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
