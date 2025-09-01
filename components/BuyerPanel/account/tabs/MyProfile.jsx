"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/authStore";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const emptyAddress = {
  tag: "home",
  name: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  isDefault: false,
  addressType: "shipTo",
};

export function MyProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    bio: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [kyc, setKyc] = useState({ status: "loading", kyc: null });
  const [kycForm, setKycForm] = useState({ gstin: "", businessName: "" });

  useEffect(() => {
    loadProfile();
    loadAddresses();
    loadKyc();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/user/profile", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          bio: data.user.bio || "",
        });
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  }

  async function loadAddresses() {
    try {
      const res = await fetch("/api/user/addresses", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Failed to load addresses", error);
    }
  }

  async function loadKyc() {
    try {
      const res = await fetch("/api/user/kyc", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setKyc(data);
        if (data.kyc) {
          setKycForm({
            gstin: data.kyc.gstin || "",
            businessName: data.kyc.details?.businessName || "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to load KYC", error);
    }
  }

  async function submitKyc() {
    try {
      const res = await fetch("/api/user/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          gstin: kycForm.gstin,
          businessName: kycForm.businessName,
        }),
      });
      if (res.ok) {
        await loadKyc();
        Swal.fire({
          icon: "success",
          title: "KYC Submitted",
          text: "Your KYC details have been submitted for review.",
        });
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.message || "Failed to submit KYC.",
        });
      }
    } catch (error) {
      console.error("Submit KYC failed", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Failed to submit KYC.",
      });
    }
  }

  function handleProfileChange(e) {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  }

  async function handleProfileSave() {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          bio: data.user.bio || "",
        });
        setUser(data.user);
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
        });
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Could not update profile.",
        });
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile.",
      });
    }
  }

  function openNewAddress() {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
    setShowAddressForm(true);
  }

  function openEditAddress(address) {
    setAddressForm({
      tag: address.tag || "home",
      name: address.name || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "India",
      isDefault: address.isDefault || false,
      addressType: address.addressType || "shipTo",
    });
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  }

  function cancelAddressForm() {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
  }

  function handleAddressChange(e) {
    const { id, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  }

  async function submitAddress() {
    try {
      if (editingAddressId) {
        const res = await fetch(`/api/user/addresses/${editingAddressId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addressForm),
        });
        if (res.ok) {
          const data = await res.json();
          setAddresses((prev) =>
            prev.map((addr) => (addr._id === editingAddressId ? data.address : addr))
          );
          await loadAddresses();
          Swal.fire({
            icon: "success",
            title: "Address Updated",
            text: "The address has been updated successfully.",
          });
        } else {
          const data = await res.json();
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: data.message || "Failed to update address.",
          });
        }
      } else {
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addressForm),
        });
        if (res.ok) {
          const data = await res.json();
          setAddresses((prev) => [...prev, data.address]);
          await loadAddresses();
          Swal.fire({
            icon: "success",
            title: "Address Added",
            text: "New address has been added successfully.",
          });
        } else {
          const data = await res.json();
          Swal.fire({
            icon: "error",
            title: "Save Failed",
            text: data.message || "Failed to add address.",
          });
        }
      }
      cancelAddressForm();
    } catch (error) {
      console.error("Address save failed", error);
      Swal.fire({
      icon: "error",
      title: "Save Failed",
      text: "Failed to save address.",
    });
  }
}

  async function deleteAddress(id) {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr._id !== id));
        await loadAddresses();
        Swal.fire({
          icon: "success",
          title: "Address Deleted",
          text: "Address deleted successfully.",
        });
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: data.message || "Failed to delete address.",
        });
      }
    } catch (error) {
      console.error("Delete address failed", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Failed to delete address.",
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={profile.firstName} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={profile.lastName} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={handleProfileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Phone Number</Label>
              <Input id="mobile" value={profile.mobile} onChange={handleProfileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="min-h-[100px]"
                value={profile.bio}
                onChange={handleProfileChange}
              />
            </div>
            <Button onClick={handleProfileSave}>Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Addresses */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ship To Addresses</CardTitle>
              <CardDescription>

                Manage your billing and shipping addresses

              </CardDescription>
            </div>
            <Button size="sm" onClick={openNewAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ship To Address
            </Button>
          </CardHeader>
          <CardContent>
            {showAddressForm && (
              <div className="border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressType">Address Type</Label>
                    <Select
                      value={addressForm.addressType}
                      onValueChange={(v) => setAddressForm((p) => ({ ...p, addressType: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billTo">Bill To</SelectItem>
                        <SelectItem value="shipTo">Ship To</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tag">Tag</Label>
                    <Select value={addressForm.tag} onValueChange={(v) => setAddressForm((p) => ({ ...p, tag: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={addressForm.name} onChange={handleAddressChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input id="street" value={addressForm.street} onChange={handleAddressChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={addressForm.city} onChange={handleAddressChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={addressForm.state} onChange={handleAddressChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" value={addressForm.zipCode} onChange={handleAddressChange} />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onCheckedChange={(checked) =>
                      setAddressForm((p) => ({ ...p, isDefault: !!checked }))
                    }
                  />
                  <Label htmlFor="isDefault">Set as default</Label>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={submitAddress}>
                    {editingAddressId ? "Update" : "Save"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelAddressForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <div key={addr._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium flex items-center gap-2">
                        <span>
                          {addr.tag
                            ? `${addr.tag.charAt(0).toUpperCase() + addr.tag.slice(1)} Address`
                            : "Address"}
                        </span>
                        {addr.addressType && (
                          <Badge variant="outline">
                            {addr.addressType === "billTo" ? "Bill To" : "Ship To"}
                          </Badge>
                        )}
                        {addr.isDefault && (
                          <span className="text-xs text-primary">(Default)</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditAddress(addr)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAddress(addr._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {addr.street}
                      <br />
                      {addr.city}, {addr.state}
                      <br />
                      {addr.zipCode}, {addr.country}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No addresses saved.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* GST / KYC Section */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>GST Verification</CardTitle>
            <CardDescription>
              Submit your GST details for KYC verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {kyc.status === "approved" && kyc.kyc ? (
              <div className="text-sm space-y-2">
                <div><span className="font-medium">GSTIN:</span> {kyc.kyc.gstin}</div>
                <div>
                  <span className="font-medium">Business Name:</span>{" "}
                  {kyc.kyc.details?.businessName}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {kyc.status === "rejected" && (
                  <div className="text-red-500 text-sm">
                    Last submission rejected {kyc.kyc?.adminRemark && `: ${kyc.kyc.adminRemark}`}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={kycForm.gstin}
                      onChange={(e) => setKycForm({ ...kycForm, gstin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={kycForm.businessName}
                      onChange={(e) =>
                        setKycForm({ ...kycForm, businessName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={submitKyc}>Submit for Approval</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Language & Region */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Language & Region</CardTitle>
            <CardDescription>
              Set your preferred language and region settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="est">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="cst">Central Time</SelectItem>
                    <SelectItem value="mst">Mountain Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
