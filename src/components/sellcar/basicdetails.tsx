import { Search } from "lucide-react";
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

interface BasicdetailsProps {
  carDetails: Cardetails;
  updateCarDetails: (updatedDetails: Partial<Cardetails>) => void;
  nextStep: () => void;
}

export default function Basicdetails({
  carDetails,
  updateCarDetails,
  nextStep,
}: BasicdetailsProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(Boolean(carDetails.Title && carDetails.Location));
  }, [carDetails.Title, carDetails.Location]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCarDetails({ Title: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCarDetails({ Location: e.target.value });
  };

  const popularCities = [
    "New Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Car Details</h2>
        <p className="text-gray-600">Let’s start with basics about your car.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="Title"
            className="block text-sm font-medium text-gray-700"
          >
            Car Title
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="Title"
              id="Title"
              value={carDetails.Title}
              onChange={handleTitleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Include make, model, variant, fuel type, and year for better visibility
          </p>
        </div>
        <div>
          <label
            htmlFor="Location"
            className="block text-sm font-medium text-gray-700"
          >
            Car Location
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="Location"
              id="Location"
              value={carDetails.Location}
              onChange={handleLocationChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Popular Cities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <button
                type="button"
                key={city}
                onClick={() => updateCarDetails({ Location: city })}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          disabled={!isValid}
          className={`py-2 px-4 rounded-md text-white ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          } transition-all duration-200`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}