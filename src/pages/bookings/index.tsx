import { useAuth } from "@/hooks/AuthProvider";
import { getbookingbyuser } from "@/lib/Booking";
import { Car, CheckCircle, Clock, Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Booking {
  id: string;
  userid: string;
  carid: string;
  bookingamount: number;
  isrefunded: boolean;
  bookingstatus: string;
  deliverystatus: string;
  location: string;
  warranty: string;
  documents: {
    registration: boolean;
    insurance: boolean;
    loan: string;
  };
  specs: {
    km: string;
    fuel: string;
    transmission: string;
  };
  deliverydate: string;
}

interface CarDetails {
  id: string;
  title: string;
  price: string;
  emi: string;
  location: string;
}

interface BookingWithCar {
  booking: Booking;
  car: CarDetails | null;
}

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getbookingbyuser(user.id);
        console.log("Booking data:", data);
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Bookings</h1>
            <p className="text-gray-600">Manage your car-related activities</p>
          </div>
          
          {bookings.length === 0 ? (
            <div className="space-y-6 text-center py-12">
              <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>
                <p className="text-gray-600 mb-6">You haven't made any bookings yet</p>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-700">
                    Start by exploring our collection of cars and book your favorite one
                  </p>
                </div>
                <Link href="/buy-car">
                  <button
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    aria-label="Explore cars"
                  >
                    Explore Cars
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((item) => (
                <div 
                  key={item.booking.id} 
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.car?.title || "Car details not available"}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Booking ID: {item.booking.id}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-32">Booking Amount:</span>
                          <span className="text-gray-900 font-semibold">
                            ₹{item.booking.bookingamount.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-32">Status:</span>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            item.booking.bookingstatus === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : item.booking.bookingstatus === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.booking.bookingstatus}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-32">Delivery Status:</span>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            item.booking.deliverystatus === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : item.booking.deliverystatus === 'delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.booking.deliverystatus}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-32">Delivery Date:</span>
                          <span className="text-gray-900">
                            {new Date(item.booking.deliverydate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-700 w-32">Location:</span>
                        <span className="text-gray-900">{item.booking.location}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="font-medium text-gray-700 w-32">Warranty:</span>
                        <span className="text-gray-900">{item.booking.warranty}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="font-medium text-gray-700 w-32">Specs:</span>
                        <div className="flex space-x-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.booking.specs.km} km</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.booking.specs.fuel}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.booking.specs.transmission}</span>
                        </div>
                      </div>
                      
                      {item.car && (
                        <div className="mt-6">
                          <Link href={`/buy-car/${item.car.id}`}>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                              View Car Details
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}