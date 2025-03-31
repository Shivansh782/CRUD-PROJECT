"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Loader2 } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/app";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddDataDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    eid: "",
    name: "",
    email: "",
    phone: "",
    extension: "",
    department: "",
    designation: "",
    vehicle: "",
    vehicleType: "", // Add vehicleType field
    joinDate: "",
  });

  const [errors, setErrors] = useState({
    eid: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    vehicleType: "", // Add vehicleType error
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Check for required fields and apply validations
    if (!formData.eid) {
      newErrors.eid = "Employee ID is required.";
      isValid = false;
    } else {
      newErrors.eid = "";
    }

    if (!formData.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required.";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (!formData.phone || !/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must only contain numbers.";
      isValid = false;
    } else {
      newErrors.phone = "";
    }

    if (!formData.department) {
      newErrors.department = "Department is required.";
      isValid = false;
    } else {
      newErrors.department = "";
    }

    if (!formData.designation) {
      newErrors.designation = "Designation is required.";
      isValid = false;
    } else {
      newErrors.designation = "";
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Vehicle type is required.";
      isValid = false;
    } else {
      newErrors.vehicleType = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "users"), formData);

      setIsOpen(false);
      setFormData({
        eid: "",
        name: "",
        email: "",
        phone: "",
        extension: "",
        department: "",
        designation: "",
        vehicle: "",
        vehicleType: "", // Reset vehicleType
        joinDate: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="">
          <Plus className="h-4 w-4" />
          Add Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-md:h-[70vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="eid">
              Employee ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="eid"
              placeholder="Enter Employee ID"
              value={formData.eid}
              onChange={handleChange}
              required
              className="w-full"
            />
            {errors.eid && <p className="text-red-500 text-sm">{errors.eid}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              placeholder="john@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">
              Designation <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designation"
              placeholder="Enter designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="w-full"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm">{errors.designation}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("department", value)
                }
                required
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                placeholder="YYYY-MM-DD"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                pattern="\d*" // Allows only numeric input
                required
                className="w-full"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="extension">Extension</Label>
              <Input
                id="extension"
                placeholder="123"
                value={formData.extension}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                id="vehicle"
                placeholder="Car"
                value={formData.vehicle}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">
                Vehicle Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("vehicleType", value)
                }
                required
              >
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-wheeler">2 Wheeler</SelectItem>
                  <SelectItem value="4-wheeler">4 Wheeler</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicleType && (
                <p className="text-red-500 text-sm">{errors.vehicleType}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding User...
              </>
            ) : (
              "Add User"
            )}
          </Button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
