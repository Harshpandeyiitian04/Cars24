export default function FeaturedCars() {
    const cars = [
  {
    id: 1,
    name: "2022 Honda City ZX",
    price: "₹12,50,000",
    km: "18,000 km",
    fuel: "Petrol",
    location: "Delhi",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "2021 Tata Nexon XZ+",
    price: "₹10,20,000",
    km: "22,000 km",
    fuel: "Diesel",
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "2020 Hyundai Creta SX",
    price: "₹13,75,000",
    km: "30,000 km",
    fuel: "Petrol",
    location: "Bangalore",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "2019 Maruti Suzuki Swift VXI",
    price: "₹6,80,000",
    km: "40,000 km",
    fuel: "Petrol",
    location: "Chennai",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80",
  },
];
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Featured Cars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="relative h-44 w-full">
                <img
                  src={car.image}
                  alt={car.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {car.name}
                </h3>
                <div className="text-blue-600 font-bold text-xl mb-2">
                  {car.price}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 mb-2">
                  <span>{car.km}</span>
                  <span>•</span>
                  <span>{car.fuel}</span>
                  <span>•</span>
                  <span>{car.location}</span>
                </div>
                <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
