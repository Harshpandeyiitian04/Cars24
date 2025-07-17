import { AlertCircle, CreditCard, DollarSign, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Cardetails {
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

interface PricingformProps {
  carDetails: Cardetails;
  updateCarDetails: (updatedDetails: Partial<Cardetails>) => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Pricingform({
  carDetails,
  updateCarDetails,
  handleSubmit,
  prevStep,
}: PricingformProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(Boolean(carDetails.Price));
  }, [carDetails.Price]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formattedValue = value ? parseInt(value, 10).toLocaleString() : "";
    updateCarDetails({ Price: formattedValue });
  };

  const handleEmiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formattedValue = value ? parseInt(value, 10).toLocaleString() : "";
    updateCarDetails({ Emi: formattedValue });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Pricing Information
        </h2>
        <p className="text-gray-600">Set your car price and EMI details</p>
      </div>
      <div className="space-y-6">
        <div>
          <div>
            <label
              htmlFor="Price"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <Tag className="h-4 w-4 mr-1 text-gray-500" />
              Car Price
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="text"
                name="Price"
                id="Price"
                value={carDetails.Price}
                onChange={handlePriceChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter price (e.g., 500000)"
                required
              />
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <p>
                  Setting the right price increases your chances of selling
                  quickly
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="Emi"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                EMI Starting From (₹)
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="text"
                  name="Emi"
                  id="Emi"
                  value={carDetails.Emi}
                  onChange={handleEmiChange}
                  className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter monthly EMI (e.g., 10000)"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">/mo</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                EMI calculated based on current interest rates and a 5-year loan
                term
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Listing Summary
              </h3>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Car Title</span>
                <span className="text-gray-900">
                  {carDetails.Title || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Location</span>
                <span className="text-gray-900">
                  {carDetails.Location || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Year</span>
                <span className="text-gray-900">
                  {carDetails.Specs.Year || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Car Price</span>
                <span className="text-gray-900">
                  {carDetails.Price ? `₹${carDetails.Price}` : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">EMI From</span>
                <span className="text-gray-900">
                  {carDetails.Emi ? `₹${carDetails.Emi}/mo` : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Images</span>
                <span className="text-gray-900">
                  {carDetails.Images.length
                    ? `${carDetails.Images.length} images`
                    : "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`py-2 px-4 rounded-md text-white flex items-center gap-1 ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition-all duration-200`}
          >
            <DollarSign className="h-4 w-4" />
            List My Car
          </button>
        </div>
      </div>
    </form>
  );
}
