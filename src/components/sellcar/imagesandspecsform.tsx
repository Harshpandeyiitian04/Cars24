import { Calendar, Plus, Upload, X } from "lucide-react";
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

interface ImagesandspecsformProps {
  carDetails: Cardetails;
  updateCarDetails: (updatedDetails: Partial<Cardetails>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Imagesandspecsform({
  carDetails,
  updateCarDetails,
  nextStep,
  prevStep,
}: ImagesandspecsformProps) {
  const [isValid, setIsValid] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const placeholderImages = [
    "https://www.shutterstock.com/image-vector/car-logo-icon-emblem-design-600w-473088025.jpg",
    "https://www.shutterstock.com/image-vector/car-logo-icon-emblem-design-600w-473088037.jpg",
  ];

  useEffect(() => {
    const { Specs } = carDetails;
    const specsFilled = Boolean(
      Specs.Year &&
        Specs.Km &&
        Specs.Fuel &&
        Specs.Transmission &&
        Specs.Owner.length > 0 &&
        Specs.Insurance.length > 0
    );
    const hasImage = carDetails.Images.length > 0;
    setIsValid(specsFilled && hasImage);
  }, [carDetails]);

  const handleImageUpload = () => {
    if (carDetails.Images.length < 10) {
      const randomImage =
        placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      updateCarDetails({ Images: [...carDetails.Images, randomImage] });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...carDetails.Images];
    updatedImages.splice(index, 1);
    updateCarDetails({ Images: updatedImages });
  };

  const handleSpecChange = (
    key: keyof Cardetails["Specs"],
    value: string | number | string[]
  ) => {
    updateCarDetails({ Specs: { ...carDetails.Specs, [key]: value } });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const years = Array.from(
    { length: 25 },
    (_, i) => new Date().getFullYear() - i
  );
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "LPG"];
  const transmissions = ["Manual", "Automatic", "AMT", "CVT", "DCT"];
  const ownerOptions = [
    "1st Owner",
    "2nd Owner",
    "3rd Owner",
    "4th Owner or More",
  ];
  const insuranceOptions = ["Comprehensive", "Third Party", "Expired"];

  return (
    <div className="space-y-6 animate-fade-up animate-duration-500 animate-ease-in-out">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 animate-fade animate-delay-100">
          Car Images and Specification
        </h2>
        <p className="text-gray-600 animate-fade animate-delay-200">
          Add photos and details about your car
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="Images"
            className="block text-sm font-medium text-gray-700"
          >
            Car Photos
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => {
              handleDrag(e);
              handleImageUpload();
            }}
            className={`mt-1 p-4 border-2 border-dashed rounded-lg text-center ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
            } transition-all duration-200`}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 animate-pulse-custom" />
            <p className="mt-2 text-sm text-gray-600">
              Drag photos here or
            </p>
            <button
              type="button"
              onClick={handleImageUpload}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 transition-all duration-200"
            >
              Browse Files
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Add up to 10 photos
            </p>
          </div>
          {carDetails.Images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {carDetails.Images.map((img, index) => (
                <div
                  key={index}
                  className="relative animate-fade animate-delay-[300ms]"
                >
                  <img
                    src={img}
                    alt={`Car image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      Cover photo
                    </div>
                  )}
                </div>
              ))}
              {carDetails.Images.length < 10 && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex items-center justify-center h-32 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200 animate-fade animate-delay-500"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Car Specification
          </h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="Year"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                Manufactured Year
              </label>
              <select
                name="Year"
                id="Year"
                value={carDetails.Specs.Year}
                onChange={(e) =>
                  handleSpecChange("Year", parseInt(e.target.value))
                }
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:scale-105 focus:shadow-md transition-all duration-200"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="Km"
                className="block text-sm font-medium text-gray-700"
              >
                Kilometers Driven
              </label>
              <input
                type="text"
                name="Km"
                id="Km"
                value={carDetails.Specs.Km}
                onChange={(e) => handleSpecChange("Km", e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:scale-105 focus:shadow-md transition-all duration-200"
                required
              />
            </div>
            <div>
              <label
                htmlFor="Fuel"
                className="block text-sm font-medium text-gray-700"
              >
                Fuel Type
              </label>
              <select
                name="Fuel"
                id="Fuel"
                value={carDetails.Specs.Fuel}
                onChange={(e) => handleSpecChange("Fuel", e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:scale-105 focus:shadow-md transition-all duration-200"
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((fuel) => (
                  <option value={fuel} key={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="Transmission"
                className="block text-sm font-medium text-gray-700"
              >
                Transmission
              </label>
              <select
                name="Transmission"
                id="Transmission"
                value={carDetails.Specs.Transmission}
                onChange={(e) => handleSpecChange("Transmission", e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:scale-105 focus:shadow-md transition-all duration-200"
              >
                <option value="">Select Transmission</option>
                {transmissions.map((transmission) => (
                  <option value={transmission} key={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="Owner"
                className="block text-sm font-medium text-gray-700"
              >
                Owner
              </label>
              <select
                name="Owner"
                id="Owner"
                value={carDetails.Specs.Owner[0] || ""}
                onChange={(e) => handleSpecChange("Owner", [e.target.value])}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:scale-105 focus:shadow-md transition-all duration-200"
              >
                <option value="">Select Owner</option>
                {ownerOptions.map((owner) => (
                  <option value={owner} key={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="Insurance"
                className="block text-sm font-medium text-gray-700"
              >
                Insurance
              </label>
              <select
                name="Insurance"
                id="Insurance"
                value={carDetails.Specs.Insurance[0] || ""}
                onChange={(e) => handleSpecChange("Insurance", [e.target.value])}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:scale-105 focus:shadow-md transition-all duration-200"
                required
              >
                <option value="">Select Insurance</option>
                {insuranceOptions.map((insurance) => (
                  <option value={insurance} key={insurance}>
                    {insurance}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 animate-fade animate-delay-500"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!isValid}
            className={`py-2 px-4 rounded-md text-white ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
            } transition-all duration-200 animate-fade animate-delay-500`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}