import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Hero from "@/components/home/hero";
import Quickaction from "@/components/home/quickaction";
import CarBrands from "@/components/home/carbrands";
import AppPromotion from "@/components/home/apppromotions";
import ServiceCards from "@/components/home/servicecards";
import CarCategories from "@/components/home/carcategories";
import FeaturedCars from "@/components/home/featuredcars";
import CustomerReviews from "@/components/home/customerreviews";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white">
      <Hero/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-white">
            <Quickaction/>
            <CarBrands/>
            <AppPromotion/>
            <ServiceCards/>
            <CarCategories/>
            <FeaturedCars/>
            <CustomerReviews/>
      </div>
    </div>
  );
}
