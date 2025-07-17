// src/pages/appointments/index.tsx
import { useAuth } from "@/hooks/AuthProvider";
import { getapppointmentbyuser, AppointmentDto } from "@/lib/Appointment";
import { Calendar, Car, Clock, MapPin, ClipboardList, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { verifyToken } from "@/lib/Userapi";
import { toast } from "react-toastify";

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userData = await verifyToken(token);
            if (!userData.id) {
              toast.error("Please login to view appointments");
              setLoading(false);
              return;
            }
            const data = await getapppointmentbyuser(userData.id);
            setAppointments(data);
          } catch (error) {
            console.error("Failed to fetch appointments:", error);
            toast.error("Invalid session. Please login again.");
            localStorage.removeItem("token");
            setAppointments([]);
          }
        } else {
          toast.error("Please login to view appointments");
          setAppointments([]);
        }
      } else {
        try {
          const data = await getapppointmentbyuser(user.id);
          setAppointments(data);
        } catch (error) {
          console.error("Failed to fetch appointments:", error);
          setAppointments([]);
        }
      }
      setLoading(false);
    };
    fetchAppointments();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div className="bg-blue-100 p-6 rounded-full">
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">No Appointments Booked</h1>
            <p className="text-gray-600 max-w-md">
              You haven't scheduled any appointments yet. Ready to sell your car?
            </p>
            <div className="bg-blue-50 p-4 rounded-lg max-w-md w-full">
              <p className="text-sm text-blue-700">
                Start with your car brand and get an offer in less than 5 minutes
              </p>
            </div>
            <Link href="/sell-car" className="w-full max-w-xs">
              <button
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                aria-label="Start selling your car"
              >
                <Car className="h-5 w-5" />
                Start Selling Your Car
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Your Appointments</h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
              </span>
            </div>
            
            <div className="grid gap-6">
              {appointments.map((appointment, index) => {
                if (!appointment.Appointment || !appointment.Appointment.Id) {
                  console.warn(`Invalid appointment data at index ${index}:`, appointment);
                  return (
                    <div
                      key={`invalid-appointment-${index}`}
                      className="border border-red-200 p-4 rounded-lg bg-red-50 shadow-sm"
                    >
                      <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Invalid appointment data (ID: {appointment.Appointment?.Id || "unknown"})
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={appointment.Appointment.Id}
                    className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Car className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {appointment.Car?.Title || "N/A"}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Price: {appointment.Car?.Price || "N/A"} | EMI: {appointment.Car?.Emi || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Date & Time</p>
                            <p className="text-gray-900">
                              {appointment.Appointment.Scheduleddate || "N/A"} at {appointment.Appointment.Scheduledtime || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-gray-900">
                              {appointment.Appointment.Location || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <ClipboardList className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Appointment Type</p>
                            <p className="text-gray-900 capitalize">
                              {appointment.Appointment.Appointmenttype?.toLowerCase() || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              appointment.Appointment.Status === 'upcoming' 
                                ? 'bg-blue-100 text-blue-800' 
                                : appointment.Appointment.Status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.Appointment.Status || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {appointment.Appointment.Notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-900">{appointment.Appointment.Notes}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}