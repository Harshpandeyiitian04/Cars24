import { AxiosError } from "axios";

const BASE_URL = "http://localhost:5083/api/Booking";

export interface Booking {
  Id?: string;
  Carid: string;
  Bookingamount: number;
  Isrefunded: boolean;
  Deliverydate?: string;
  Nextservicedate?: string;
  Bookedat?: string;
  Bookingstatus: string;
  Deliverystatus: string;
  Location: string;
  Warranty: string;
  Documents: {
    Registration: boolean;
    Insurance: boolean;
    Loan: string;
  };
  Specs: {
    Km: string;
    Fuel: string;
    Transmission: string;
  };
}

// C:\Users\harsh\OneDrive\Documents\cars24\cars24\src\lib\Booking.ts
export const createbooking = async (userid: string, booking: Booking) => {
  try {
    console.log("Sending booking payload:", JSON.stringify(booking, null, 2));
    const response = await fetch(`${BASE_URL}/create/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Failed to create booking (Status: ${response.status})`;

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        errorMessage = errorData.message || errorMessage;
      } else {
        const text = await response.text();
        console.error("Non-JSON error response:", text);
        errorMessage = `Server error: ${text} (Status: ${response.status})`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getbookingbyid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch booking");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    throw error;
  }
};

export const getbookingbyuser = async (userid: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userid}/bookings`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch bookings");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};