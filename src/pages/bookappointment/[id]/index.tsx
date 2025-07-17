// src/pages/bookappointment/[id]/index.tsx
import { useAuth } from "@/hooks/AuthProvider";
import { createappointment } from "@/lib/Appointment";
import { AlertCircle, Calendar, HomeIcon, MapPin } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { verifyToken } from "@/lib/Userapi";

export default function BookAppointment() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Scheduleddate: "",
    Scheduledtime: "",
    Location: "",
    Appointmenttype: "branch_visit",
    Notes: "",
  });

  const availabletime = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let userId: string;
    if (!user?.id) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await verifyToken(token);
          if (!userData.id) {
            toast.error("Invalid user data. Please login again.");
            router.push("/login");
            return;
          }
          userId = userData.id;
        } catch (error) {
          toast.error("Invalid session. Please login again.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
      } else {
        toast.error("Please login first");
        router.push("/login");
        return;
      }
    } else {
      userId = user.id;
    }

    if (!router.query.id) {
      toast.error("Car ID is missing");
      return;
    }

    // Validate userId and carId
    const carId = router.query.id as string;
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      toast.error(`Invalid User ID format: ${userId}`);
      return;
    }
    if (!/^[0-9a-fA-F]{24}$/.test(carId)) {
      toast.error(`Invalid Car ID format: ${carId}`);
      return;
    }

    if (!formData.Scheduleddate || !formData.Scheduledtime || !formData.Location) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(`Submitting appointment for Userid: ${userId}, Carid: ${carId}`);
      await createappointment(userId, carId, formData);
      toast.success("Appointment booked successfully");
      router.push("/appointments");
    } catch (error: any) {
      console.error("Booking error:", error.message);
      toast.error(`Failed to book appointment: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="max-w-md mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Schedule Car Inspection
            </h1>
            <p className="text-gray-600">
              Book an appointment for your car inspection
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                Select Date
              </label>
              <input
                type="date"
                name="Scheduleddate"
                value={formData.Scheduleddate}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                Select Time
              </label>
              <select
                name="Scheduledtime"
                value={formData.Scheduledtime}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              >
                <option value="">Choose a time slot</option>
                {availabletime.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                Location
              </label>
              <input
                type="text"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                placeholder="Enter inspection location"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Appointment Type
              </label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    formData.Appointmenttype === "home_inspection"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="Appointmenttype"
                    value="home_inspection"
                    checked={formData.Appointmenttype === "home_inspection"}
                    onChange={handleChange}
                    className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-blue-600 mr-2"
                  />
                  <HomeIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Home Inspection</p>
                    <p className="text-sm text-gray-500">We'll come to you</p>
                  </div>
                </label>
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    formData.Appointmenttype === "branch_visit"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="Appointmenttype"
                    value="branch_visit"
                    checked={formData.Appointmenttype === "branch_visit"}
                    onChange={handleChange}
                    className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-blue-600 mr-2"
                  />
                  <HomeIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Branch Visit</p>
                    <p className="text-sm text-gray-500">Visit our branch</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                name="Notes"
                rows={3}
                value={formData.Notes}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Any special requirements or notes for the inspection"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-blue-800" />
                <h3 className="text-sm font-medium text-blue-800">
                  Required Documents
                </h3>
              </div>
              <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-6 list-disc">
                <li>Original Registration Certificate (RC)</li>
                <li>Valid Insurance Papers</li>
                <li>Service History Records (if available)</li>
                <li>Valid ID Proof</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Processing..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}