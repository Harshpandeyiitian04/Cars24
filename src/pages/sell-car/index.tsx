// src/pages/sell-car/index.tsx
import Carform from "@/components/sellcar/carform";
import { useAuth } from "@/hooks/AuthProvider";
import { Cardetails, createcar } from "@/lib/Carapi";
import { Car, Check, FileText, Image, DollarSign } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { verifyToken } from "@/lib/Userapi";

interface Step {
  id: number;
  name: string;
  icon: React.ComponentType<any>;
}

export default function SellCar() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [carDetails, setCarDetails] = useState<Cardetails>({
    Title: "",
    Images: [],
    Price: "",
    Emi: "",
    Location: "",
    Status: "", // Ensure status field exists
    Specs: {
      Year: new Date().getFullYear(),
      Km: "0",
      Fuel: "",
      Transmission: "",
      Owner: [],
      Insurance: [],
    },
    Features: [],
    Highlights: [],
  });

  const steps: Step[] = [
    { id: 1, name: "Basic Details", icon: Car },
    { id: 2, name: "Images and Specs", icon: Image },
    { id: 3, name: "Features", icon: FileText },
    { id: 4, name: "Pricing", icon: DollarSign },
  ];

  const updateCarDetails = (updatedDetails: Partial<Cardetails>) => {
    setCarDetails((prev) => ({
      ...prev,
      ...updatedDetails,
      Specs: { ...prev.Specs, ...updatedDetails.Specs },
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await verifyToken(token);
          setUser(userData); // Update AuthProvider user state
          if (!userData.id) {
            toast.error("Please login first");
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
        } catch (error: any) {
          toast.error("Invalid session. Please login again.");
          localStorage.removeItem("token");
          setUser(null); // Clear user state
          router.push("/login");
          return;
        }
      } else {
        toast.error("Please login first");
        router.push("/login");
        return;
      }
    }

    // Construct form data from carDetails state
    const formData = {
      Title: carDetails.Title,
      Images: carDetails.Images,
      Price: carDetails.Price.replace(/,/g, ""),
      Emi: carDetails.Emi.replace(/,/g, ""),
      Location: carDetails.Location,
      Features: carDetails.Features,
      Highlights: carDetails.Highlights,
      Specs: {
        Year: carDetails.Specs.Year,
        Km: carDetails.Specs.Km,
        Fuel: carDetails.Specs.Fuel,
        Transmission: carDetails.Specs.Transmission,
        Owner: carDetails.Specs.Owner,
        Insurance: carDetails.Specs.Insurance,
      },
    };

    // Basic validation
    if (
      !formData.Title ||
      !formData.Price ||
      !formData.Location ||
      !formData.Specs.Year ||
      !formData.Specs.Fuel ||
      !formData.Specs.Transmission ||
      !formData.Specs.Owner.length ||
      !formData.Specs.Insurance.length
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      console.log("Form Data:", formData);
      const car = await createcar({ car: formData });
      toast.success("Car created successfully");
      router.push(`/bookappointment/${car.id}`);
    } catch (error: any) {
      console.error("Error creating car:", error.message);
      toast.error(`Failed to create car: ${error.message || "Please try again."}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sell Your Car</h1>
            <p className="text-lg text-gray-600">
              Fill in the details below to get the best price for your car
            </p>
            <div className="flex items-center justify-center space-x-4 mt-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          currentStep >= step.id
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {currentStep > step.id ? <Check /> : <StepIcon />}
                      </div>
                      <span className="text-sm text-gray-700 mt-2">
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                        } transition-all duration-200`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Carform
              carDetails={carDetails}
              updateCarDetails={updateCarDetails}
              currentStep={currentStep}
              nextStep={nextStep}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}