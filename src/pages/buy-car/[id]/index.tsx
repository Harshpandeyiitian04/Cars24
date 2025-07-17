import { useRouter } from "next/router";
import { SiTransmission } from "react-icons/si";
import {
  FaCalendarAlt,
  FaTachometerAlt,
  FaGasPump,
  FaUser,
  FaShieldAlt,
  FaWindowMaximize,
  FaSnowflake,
  FaUserShield,
  FaCheckCircle,
  FaFileAlt,
  FaCar,
} from "react-icons/fa";
import { BsFillCarFrontFill } from "react-icons/bs";
import React, { JSX, useEffect, useState } from "react";
import { getcarbyid } from "@/lib/Carapi";
import { createbooking } from "@/lib/Booking";
import { useAuth } from "@/hooks/AuthProvider";
import { toast } from "react-toastify";
import { Booking } from "@/lib/types/types";

interface Car {
  Id: string;
  Title: string;
  Images: string[];
  Price: string;
  Emi: string;
  Location: string;
  Specs: {
    Year: number;
    Km: string;
    Fuel: string;
    Transmission: string;
    Owner: string[];
    Insurance: string[];
  };
  Features: string[];
  Highlights: string[];
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  preferreddate: string;
  preferredtime: string;
  paymentmethod: string;
  loanrequired: string;
  downpayment: string;
}

interface IconMap {
  [key: string]: JSX.Element;
}

export default function Car() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    preferreddate: "",
    preferredtime: "",
    paymentmethod: "",
    loanrequired: "no",
    downpayment: "",
  });
  const [step, setStep] = useState(1);
  const [carDetails, setCarDetails] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchCar() {
      try {
        const data = await getcarbyid(id as string);
        console.log("API Response:", data); // Debug: Log raw API response

        // Map API response to Car interface, handling case sensitivity
        const mappedData: Car = {
          Id: data.id || data.Id || "N/A",
          Title: data.title || data.Title || "N/A",
          Images: Array.isArray(data.images || data.Images) ? data.images || data.Images : [],
          Price: data.price || data.Price || "N/A",
          Emi: data.emi || data.Emi || "N/A",
          Location: data.location || data.Location || "N/A",
          Specs: (data.specs || data.Specs) && typeof (data.specs || data.Specs) === "object" ? {
            Year: data.specs?.year || data.Specs?.Year || 0,
            Km: data.specs?.km || data.Specs?.Km || "N/A",
            Fuel: data.specs?.fuel || data.Specs?.Fuel || "N/A",
            Transmission: data.specs?.transmission || data.Specs?.Transmission || "N/A",
            Owner: Array.isArray(data.specs?.owner || data.Specs?.Owner) 
              ? (data.specs?.owner || data.Specs?.Owner) 
              : typeof (data.specs?.owner || data.Specs?.Owner) === "string" 
                ? [(data.specs?.owner || data.Specs?.Owner)] 
                : [],
            Insurance: Array.isArray(data.specs?.insurance || data.Specs?.Insurance) 
              ? (data.specs?.insurance || data.Specs?.Insurance) 
              : [],
          } : {
            Year: 0,
            Km: "N/A",
            Fuel: "N/A",
            Transmission: "N/A",
            Owner: [],
            Insurance: [],
          },
          Features: Array.isArray(data.features || data.Features) ? data.features || data.Features : [],
          Highlights: Array.isArray(data.highlights || data.Highlights) ? data.highlights || data.Highlights : [],
        };

        console.log("Mapped carDetails:", mappedData); // Debug: Log mapped data
        setCarDetails(mappedData);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setCarDetails(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user?.id) {
    toast.error("Please login first");
    return;
  }
  if (!carDetails) {
    toast.error("Car details not available");
    return;
  }
  if (!validateStep()) {
    toast.error("Please fill in all required fields.");
    return;
  }

  try {
    let deliveryDate: string | undefined;
    if (formData.preferreddate && formData.preferredtime) {
      const timeParts = formData.preferredtime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeParts) {
        throw new Error("Invalid time format");
      }
      let [_, hours, minutes, period] = timeParts;
      let hoursNum = parseInt(hours, 10);
      const minutesStr = minutes.padStart(2, "0");
      if (period.toUpperCase() === "PM" && hoursNum !== 12) {
        hoursNum += 12;
      } else if (period.toUpperCase() === "AM" && hoursNum === 12) {
        hoursNum = 0;
      }
      const time24 = `${hoursNum.toString().padStart(2, "0")}:${minutesStr}:00`;

      const dateString = `${formData.preferreddate}T${time24}`;
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date or time value");
      }
      deliveryDate = parsedDate.toISOString();
    }

    const booking: Booking = {
      Carid: carDetails.Id,
      Bookingamount: parseFloat(carDetails.Price.replace("Rs", "").replace(" lakh", "")) * 100000 * 0.1,
      Isrefunded: false,
      Bookingstatus: "pending",
      Deliverystatus: "pending",
      Location: carDetails.Location,
      Warranty: "1 year",
      Deliverydate: deliveryDate,
      Documents: {
        Registration: true,
        Insurance: true,
        Loan: formData.loanrequired === "yes" ? formData.downpayment : "",
      },
      Specs: {
        Km: carDetails.Specs.Km || "N/A",
        Fuel: carDetails.Specs.Fuel || "N/A",
        Transmission: carDetails.Specs.Transmission || "N/A",
      },
    };

    await createbooking(user.id, booking);
    toast.success("Booking created successfully");
    router.push("/bookings");
  } catch (error: any) {
    console.error("Booking error:", error);
    toast.error(error.message || "Failed to create booking. Please try again.");
  }
};

  const validateStep = () => {
  if (step === 1) {
    return formData.name && formData.phone && formData.email;
  }
  if (step === 2) {
    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    // Validate time format (HH:MM AM/PM)
    const timePattern = /^\d{1,2}:\d{2}\s*(AM|PM)$/i;
    return (
      formData.preferreddate &&
      datePattern.test(formData.preferreddate) &&
      formData.preferredtime &&
      timePattern.test(formData.preferredtime)
    );
  }
  if (step === 3) {
    return (
      formData.paymentmethod &&
      (formData.loanrequired === "no" ||
        (formData.loanrequired === "yes" && formData.downpayment))
    );
  }
  return true;
};

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const availabletime = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

  // Base64-encoded 1x1 gray pixel as ultimate fallback
  const FALLBACK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!carDetails) {
    return (
      <div className="text-center mt-10 text-red-500">
        Car Not Found.
      </div>
    );
  }

  const featureIcons: IconMap = {
    "Power Steering": <FaCar className="inline mr-2 text-gray-500" />,
    "Power Windows": <FaWindowMaximize className="inline mr-2 text-gray-500" />,
    "Air Conditioning": <FaSnowflake className="inline mr-2 text-gray-500" />,
    "Driver Airbag": <FaUserShield className="inline mr-2 text-gray-500" />,
    "Passenger Airbag": <FaUserShield className="inline mr-2 text-gray-500" />,
    "Alloy Wheels": <BsFillCarFrontFill className="inline mr-2 text-gray-500" />,
  };

  const highlightIcons: IconMap = {
    "Single owner vehicle": <FaUser className="inline mr-2 text-gray-500" />,
    "All original document": <FaFileAlt className="inline mr-2 text-gray-500" />,
    "Non-accidental": <FaCheckCircle className="inline mr-2 text-gray-500" />,
    "Fully maintained": <FaCheckCircle className="inline mr-2 text-gray-500" />,
    "Single Owner": <FaUser className="inline mr-2 text-gray-500" />, // Match API data
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              {carDetails.Images.length > 0 ? (
                <img
                  src={carDetails.Images[0]}
                  alt={carDetails.Title || "Car image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE; // Use base64 fallback
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              {carDetails.Images.length > 0 ? (
                carDetails.Images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Car image ${index + 1}`}
                    className="w-24 h-16 object-cover rounded-md border border-gray-200 hover:opacity-75 cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE; // Use base64 fallback
                    }}
                  />
                ))
              ) : (
                <div className="w-24 h-16 flex items-center justify-center bg-gray-200 rounded-md border border-gray-200">
                  <p className="text-gray-500 text-sm">No image</p>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {carDetails.Title || "N/A"}
            </h2>
            <p className="text-sm text-gray-500">ID: {id}</p>
            <p className="text-lg font-medium text-gray-700 flex items-center">
              <BsFillCarFrontFill className="mr-2 text-gray-500" />
              {carDetails.Location || "N/A"}
            </p>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Complete Your Purchase
              </h3>
              <div className="flex items-center justify-center mb-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        step >= s
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-12 h-1 ${
                          step > s ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="preferreddate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="preferreddate"
                        name="preferreddate"
                        value={formData.preferreddate}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="preferredtime"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preferred Time *
                      </label>
                      <select
                        id="preferredtime"
                        name="preferredtime"
                        value={formData.preferredtime}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a time</option>
                        {availabletime.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="paymentmethod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Method *
                      </label>
                      <select
                        id="paymentmethod"
                        name="paymentmethod"
                        value={formData.paymentmethod}
                        onChange={handleInputChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select payment method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="loan">Loan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loan Required *
                      </label>
                      <div className="mt-1 flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="loanrequired"
                            value="yes"
                            checked={formData.loanrequired === "yes"}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="loanrequired"
                            value="no"
                            checked={formData.loanrequired === "no"}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                    {formData.loanrequired === "yes" && (
                      <div>
                        <label
                          htmlFor="downpayment"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Down Payment *
                        </label>
                        <input
                          type="text"
                          id="downpayment"
                          name="downpayment"
                          value={formData.downpayment}
                          onChange={handleInputChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                      Previous
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                      Next
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-2xl font-semibold text-green-600">
                ₹ {carDetails.Price || "N/A"}
              </p>
              <p className="text-lg text-gray-600">EMI: ₹ {carDetails.Emi || "N/A"}</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                Contact Seller
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">
                Specifications
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="text-base font-medium">
                      {carDetails.Specs.Year || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaTachometerAlt className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Kilometers</p>
                    <p className="text-base font-medium">
                      {carDetails.Specs.Km || "N/A"} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaGasPump className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel</p>
                    <p className="text-base font-medium">
                      {carDetails.Specs.Fuel || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <SiTransmission className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="text-base font-medium">
                      {carDetails.Specs.Transmission || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="text-base font-medium">
                      {carDetails.Specs.Owner?.[0] || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Insurance</p>
                    <p className="text-base font-medium">
                      {carDetails.Specs.Insurance?.[0] || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">Features</h3>
              <ul className="mt-4 list-none space-y-2">
                {carDetails.Features.length > 0 ? (
                  carDetails.Features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-base text-gray-700 flex items-center"
                    >
                      {featureIcons[feature] || (
                        <FaCheckCircle className="inline mr-2 text-gray-500" />
                      )}
                      {feature}
                    </li>
                  ))
                ) : (
                  <li className="text-base text-gray-700">No features available</li>
                )}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">Highlights</h3>
              <ul className="mt-4 list-none space-y-2">
                {carDetails.Highlights.length > 0 ? (
                  carDetails.Highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="text-base text-gray-700 flex items-center"
                    >
                      {highlightIcons[highlight] || (
                        <FaCheckCircle className="inline mr-2 text-gray-500" />
                      )}
                      {highlight}
                    </li>
                  ))
                ) : (
                  <li className="text-base text-gray-700">No highlights available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}