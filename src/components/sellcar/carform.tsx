// src/components/sellcar/carform.tsx
import React from "react";
import Basicdetails from "./basicdetails";
import Imagesandspecsform from "./imagesandspecsform";
import Featuresform from "./featuresform";
import Pricingform from "./pricingform";
import { Cardetails } from "@/lib/Carapi";

interface CarformProps {
  carDetails: Cardetails;
  updateCarDetails: (updatedDetails: Partial<Cardetails>) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Carform({
  carDetails,
  updateCarDetails,
  currentStep,
  nextStep,
  prevStep,
  handleSubmit,
}: CarformProps) {
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Basicdetails
            carDetails={carDetails}
            updateCarDetails={updateCarDetails}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Imagesandspecsform
            carDetails={carDetails}
            updateCarDetails={updateCarDetails}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Featuresform
            carDetails={carDetails}
            updateCarDetails={updateCarDetails}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Pricingform
            carDetails={carDetails}
            updateCarDetails={updateCarDetails}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return <div className="w-full">{renderStep()}</div>;
}