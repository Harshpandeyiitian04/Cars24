import { Car } from "lucide-react";

const brands = [
  {
    name: "Honda",
    logo: "https://imgs.search.brave.com/rk6sC8UZPFlOtJ3zZC3jcXTJKxyVUD-onvUHIILknHw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8zLzM4L0hv/bmRhLnN2Zy82NDBw/eC1Ib25kYS5zdmcu/cG5n",
    id: 1
  },
  {
    name: "BMW",
    logo: "https://imgs.search.brave.com/_e9t85fQHL1xkzeLy8gafZTGzAp9RxgFaDrzF3kUx5s/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9mL2Y0L0JN/V19sb2dvXyUyOGdy/YXklMjkuc3ZnLzI1/MHB4LUJNV19sb2dv/XyUyOGdyYXklMjku/c3ZnLnBuZw",
    id: 2
  },
  {
    name: "Mercedes-Benz",
    logo: "https://imgs.search.brave.com/7TIePVjx0M4wAhA731BfBoXsFX9xDwbAnsG3Fspgdkg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi85LzllL01l/cmNlZGVzLUJlbnpf/TG9nb18yMDEwLnN2/Zy8yNTBweC1NZXJj/ZWRlcy1CZW56X0xv/Z29fMjAxMC5zdmcu/cG5n",
    id: 3
  },
  {
    name: "Toyota",
    logo: "https://imgs.search.brave.com/v_jWB1cljB_stl6gJy-5e5fLXC3uWWhdNBmW5Jz0e5o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9lL2U3L1Rv/eW90YS5zdmcvMjUw/cHgtVG95b3RhLnN2/Zy5wbmc",
    id: 4
  },
  {
    name: "Audi",
    logo: "https://imgs.search.brave.com/huIXWx9XXV5Hdk3ZT3ququBctJuDIUwDIBr0kuWfIhg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi85LzkyL0F1/ZGktTG9nb18yMDE2/LnN2Zy8yNTBweC1B/dWRpLUxvZ29fMjAx/Ni5zdmcucG5n",
    id: 5
  },
  {
    name: "Hyundai",
    logo: "https://imgs.search.brave.com/ZPKfIkqoK0TMGQ2lNT8-9RT_RLRxufFQXNcSciutkjc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi80LzQ0L0h5/dW5kYWlfTW90b3Jf/Q29tcGFueV9sb2dv/LnN2Zy85NjBweC1I/eXVuZGFpX01vdG9y/X0NvbXBhbnlfbG9n/by5zdmcucG5n",
    id: 6
  },
  {
    name: "Tata",
    logo: "https://imgs.search.brave.com/yIyuitEFk8b9hhyO4NQYYM0zIx7yQ06k-mdK55C8sZY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi84LzhlL1Rh/dGFfbG9nby5zdmcv/MjUwcHgtVGF0YV9s/b2dvLnN2Zy5wbmc",
    id: 7
  },
];

export default function CarBrands() {
  return (
    <div className="py-8 mt-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="h-px bg-gray-200 w-10" />
          <div className="px-4">
            <div className="flex items-center justify-center bg-orange-500 rounded-full p-2">
              <Car size={24} className="text-white" />
            </div>
          </div>
          <div className="h-px bg-gray-200 w-10" />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex flex-col items-center justify-center transition-transform hover:scale-105"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-12 w-24 object-contain"
              loading="lazy" // Added lazy loading for better performance
            />
            <span className="sr-only">{brand.name}</span> {/* For accessibility */}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button className="text-orange-500 font-medium hover:text-orange-700 transition-colors">
          View all cars
        </button>
      </div>
    </div>
  );
}