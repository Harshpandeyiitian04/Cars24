import { Car } from "lucide-react";
import Link from "next/link";

const carcategories = [
  {
    name: "Hatchback",
    icon: Car,
    href: "/cars/hatchback",
    image:
      "https://imgs.search.brave.com/W5Rx0K0f1IVZRPUDmol0OId4D-XsDObD1xB0ByW3dNs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8yLzIwL1Zv/bGtzd2FnZW5fR29s/Zl9WSUlJX0lNR180/MDIzLmpwZy81MTJw/eC1Wb2xrc3dhZ2Vu/X0dvbGZfVklJSV9J/TUdfNDAyMy5qcGc",
  },
  {
    name: "Sedan",
    icon: Car,
    href: "/cars/sedan",
    image:
      "https://imgs.search.brave.com/DllfpKe_V2GuLVbTyXC1J88d285I7CTroVzUsKWO168/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi85LzkzLzIw/MTlfQk1XXzc0MExp/X0F1dG9tYXRpY19m/YWNlbGlmdF8zLjAu/anBnLzUxMnB4LTIw/MTlfQk1XXzc0MExp/X0F1dG9tYXRpY19m/YWNlbGlmdF8zLjAu/anBn",
  },
  {
    name: "SUV",
    icon: Car,
    href: "/cars/suv",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia_Mohave_3.0_D_HM_PE2_Snow_White_Pearl_%2834%29_%28cropped%29.jpg/1920px-Kia_Mohave_3.0_D_HM_PE2_Snow_White_Pearl_%2834%29_%28cropped%29.jpg",
  },
];

export default function CarCategories() {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Browse by car types
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {carcategories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative flex flex-col items-center justify-end bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors min-h-[220px] overflow-hidden"
            style={{
              backgroundImage: `url(${category.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="relative z-10 flex flex-col items-center">
              <category.icon className="h-12 w-12 text-blue-600 mb-3" />
              <span className="text-lg font-medium text-white drop-shadow">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
