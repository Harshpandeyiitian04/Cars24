import { Car, Mail, Phone, Settings, User } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthProvider";
import axios from "axios";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<{
    id: string;
    fullname: string;
    email: string;
    phone: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // ... other code ...

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5083/api/usersauth/${user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfileData(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch profile data."
        );
      }
    };

    // ... other code ...

    if (user) {
      fetchProfile();
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="max-w-md mx-auto p-6">
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 p-3 rounded-md flex items-center gap-2">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src={`https://gravatar.com/avatar/60c15dac066f8398cddce235cb38a097?s=400&d=robohash&r=x`}
                alt="User avatar"
                className="h-16 w-16 rounded-full border border-gray-300"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profileData.fullname} 
            </h1>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
          <section className="space-y-6">
            <div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h2>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Full Name:</span>
                  <span className="text-gray-900">{profileData.fullname}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Phone No.:</span>
                  <span className="text-gray-900">{profileData.phone}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                  aria-label="Go to account settings"
                >
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/bookings")}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                  aria-label="View my cars"
                >
                  <Car className="h-5 w-5" />
                  <span>My Cars</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/appointments")}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                  aria-label="View appointments"
                >
                  <Car className="h-5 w-5" />
                  <span>Appointments</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200"
                  aria-label="Sign out"
                >
                  <Car className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
