import { Slider } from "@/components/ui/slider";
import { getcarsummaries } from "@/lib/Carapi";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
  Status?: string;
}

const getBrand = (title?: string): string => {
  if (!title) return "Unknown Brand";
  const words = title.split(" ");
  if (words.length === 0) return "Unknown Brand";
  return words.length > 1 && words[0] === "Maruti" 
    ? `${words[0]} ${words[1]}` 
    : words[0];
};

const parseCarPrice = (price: string): number => {
  if (!price) return 0;
  // Handle various price formats: "Rs 5.5 lakh", "₹5.5 L", "550000", etc.
  const numericValue = parseFloat(price.replace(/[^0-9.]/g, ''));
  if (isNaN(numericValue)) return 0;
  
  // If price is in lakhs (contains "lakh" or "L")
  if (price.toLowerCase().includes('lakh') || price.toLowerCase().includes('l')) {
    return numericValue * 100000;
  }
  return numericValue; // Assume it's already in rupees
};

function Loadercard() {
  return (
    <div className="bg-white rounded-lg shadow-md animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200"></div>
      <div className="space-y-2 p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export default function BuyCar() {
  const [pricerange, setPricerange] = useState<number[]>([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("price-asc");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await getcarsummaries();
        
        const transformedData = data.map((car: any) => ({
          Id: car.id || car.Id || "",
          Title: car.title || car.Title || "Unknown Car",
          Images: car.images || car.Images || [],
          Price: car.price || car.Price || "0",
          Emi: car.emi || car.Emi || "0",
          Location: car.location || car.Location || "Unknown Location",
          Specs: {
            Year: car.specs?.year || car.Specs?.Year || 0,
            Km: car.specs?.km || car.Specs?.Km || "0",
            Fuel: car.specs?.fuel || car.Specs?.Fuel || "Unknown",
            Transmission: car.specs?.transmission || car.Specs?.Transmission || "Unknown",
            Owner: Array.isArray(car.specs?.owner) ? car.specs.owner : 
                  Array.isArray(car.Specs?.Owner) ? car.Specs.Owner : 
                  ["Unknown"],
            Insurance: Array.isArray(car.specs?.insurance) ? car.specs.insurance : 
                      Array.isArray(car.Specs?.Insurance) ? car.Specs.Insurance : 
                      ["Unknown"]
          },
          Features: car.features || car.Features || [],
          Highlights: car.highlights || car.Highlights || [],
          Status: car.status || car.Status || ""
        }));

        setCars(transformedData);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const uniqueBrands = Array.from(
    new Set(
      cars.map((c) => getBrand(c.Title)).filter(brand => brand !== "Unknown Brand")
    )
  ).sort();

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleFavoriteToggle = (carId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  const filteredCars = cars
    .filter((car) => {
      try {
        // Skip if missing critical data
        if (!car?.Price || !car?.Title) return false;

        // Parse price with robust function
        const priceNum = parseCarPrice(car.Price);
        
        // Check price range
        const withinPriceRange = priceNum >= pricerange[0] && priceNum <= pricerange[1];
        if (!withinPriceRange) return false;

        // Check brand filter
        const brand = getBrand(car.Title);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);
        if (!matchesBrand) return false;

        // Check search query
        const matchesSearch = car.Title.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
      } catch (error) {
        console.error("Error filtering car:", car, error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const aPrice = parseCarPrice(a.Price);
        const bPrice = parseCarPrice(b.Price);
        const aKm = parseFloat(a.Specs.Km.replace(/,/g, '')) || 0;
        const bKm = parseFloat(b.Specs.Km.replace(/,/g, '')) || 0;

        switch (sortOption) {
          case "price-asc": return aPrice - bPrice;
          case "price-desc": return bPrice - aPrice;
          case "km-asc": return aKm - bKm;
          case "km-desc": return bKm - aKm;
          default: return 0;
        }
      } catch (error) {
        console.error("Error sorting cars:", error);
        return 0;
      }
    });

  const formatPrice = (price: string): string => {
    const priceNum = parseCarPrice(price);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceNum);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => <Loadercard key={i} />)}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="font-semibold text-lg mb-4 text-black">Filter</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-800">
                    Price Range
                  </label>
                  <Slider
                    defaultValue={[0, 1000000]}
                    max={1500000}
                    step={10000}
                    value={pricerange}
                    onValueChange={setPricerange}
                    className="mt-2"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{formatPrice(`${pricerange[0]}`)}</span>
                    <span>{formatPrice(`${pricerange[1]}`)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-800">
                    Brands
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder="Search cars (e.g., Baleno, Hyundai)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 max-w-md transition text-black"
                />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-48 p-2 pr-8 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%204%205%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:16px_12px] transition text-black"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="km-asc">KM: Low to High</option>
                  <option value="km-desc">KM: High to Low</option>
                </select>
              </div>
            </div>
            
            {/* Cars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <Link
                    href={`/buy-car/${car.Id}`}
                    key={car.Id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block relative"
                  >
                    {car.Status && (
                      <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full z-10">
                        {car.Status.replace("_", " ")}
                      </div>
                    )}
                    
                    <div className="relative">
                      <img
                        src={car.Images[0] || "/placeholder-car.jpg"}
                        alt={car.Title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-car.jpg";
                        }}
                      />
                      <button
                        onClick={(e) => handleFavoriteToggle(car.Id, e)}
                        className="absolute top-2 right-2 p-1 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100 transition z-10"
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.includes(car.Id) ? "fill-red-500 text-red-500" : "fill-none text-gray-600"}`}
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">
                        {car.Title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {car.Specs.Year} • {car.Specs.Km} km • {car.Specs.Fuel}
                      </p>
                      <p className="text-lg font-bold text-green-600 mb-1">
                        {formatPrice(car.Price)}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        EMI from {formatPrice(car.Emi)}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {car.Location}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No cars found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedBrands.length > 0 || searchQuery 
                        ? "Try adjusting your filters or search query"
                        : "There are currently no cars available for sale"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}