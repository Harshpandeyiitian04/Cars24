import { CheckCircle, Plus, X } from "lucide-react";
import { useState } from "react";

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

interface FeaturesformProps {
  carDetails: Cardetails;
  updateCarDetails: (updatedDetails: Partial<Cardetails>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Featuresform({
  carDetails,
  updateCarDetails,
  nextStep,
  prevStep,
}: FeaturesformProps) {
  const [newFeature, setNewFeature] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const isValid = Boolean(carDetails.Features.length > 0 || carDetails.Highlights.length > 0);

  const addFeature = () => {
    if (newFeature.trim() && !carDetails.Features.includes(newFeature.trim())) {
      updateCarDetails({
        Features: [...carDetails.Features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...carDetails.Features];
    updatedFeatures.splice(index, 1);
    updateCarDetails({ Features: updatedFeatures });
  };

  const addHighlight = () => {
    if (newHighlight.trim() && !carDetails.Highlights.includes(newHighlight.trim())) {
      updateCarDetails({
        Highlights: [...carDetails.Highlights, newHighlight.trim()],
      });
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    const updatedHighlights = [...carDetails.Highlights];
    updatedHighlights.splice(index, 1);
    updateCarDetails({ Highlights: updatedHighlights });
  };

  const suggestedFeatures = [
    "Air Conditioning",
    "Power Steering",
    "Power Windows",
    "Anti-Lock Braking System",
    "Driver Airbag",
    "Passenger Airbag",
    "Automatic Climate Control",
    "Alloy Wheels",
    "Fog Lights",
    "Multi-function Steering Wheel",
    "Touch Screen",
    "Rear AC Vents",
  ];
  const suggestedHighlights = [
    "Single Owner",
    "No Accidents",
    "All Service Records Available",
    "Recently Serviced",
    "New Tires",
    "Excellent Condition",
    "Low Mileage",
    "Extended Warranty",
    "Non-Smoker Owner",
  ];

  return (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Car Features and Highlights
        </h2>
        <p className="text-gray-600">
          Add important features and details about your car
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Car Features</h3>
          </div>
          <p className="text-sm text-gray-600">
            Add notable features of your car that buyers should know about
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              name="newFeature"
              id="newFeature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Suggested Features</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedFeatures.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => {
                    if (!carDetails.Features.includes(feature)) {
                      updateCarDetails({
                        Features: [...carDetails.Features, feature],
                      });
                    }
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
          {carDetails.Features.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Added Features</h4>
              <div className="mt-2 space-y-2">
                {carDetails.Features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <span className="text-sm text-gray-900">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Car Highlights</h3>
          </div>
          <p className="text-sm text-gray-600">
            Add notable highlights of your car that buyers should know about
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              name="newHighlight"
              id="newHighlight"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHighlight();
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter a highlight"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">
              Suggested Highlights
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedHighlights.map((highlight) => (
                <button
                  key={highlight}
                  type="button"
                  onClick={() => {
                    if (!carDetails.Highlights.includes(highlight)) {
                      updateCarDetails({
                        Highlights: [...carDetails.Highlights, highlight],
                      });
                    }
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                >
                  {highlight}
                </button>
              ))}
            </div>
          </div>
          {carDetails.Highlights.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">
                Added Highlights
              </h4>
              <div className="mt-2 space-y-2">
                {carDetails.Highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <span className="text-sm text-gray-900">{highlight}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
    </div>
  );
}