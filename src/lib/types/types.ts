// types.ts
export interface User {
  id?: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  avatar_url?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: User;
  error?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    fullname: string;
    email: string;
    phone: string;
  };
}

export interface UserResponse {
  id: string;
  fullname: string;
  email: string;
  phone: string;
}

// src/types/CarDetails.ts
export interface CarDetails {
  Title: string;
  Images: string[];
  Price: string;
  Emi: string;
  Location: string;
  Specs: {
    Year: number;
    Km: number; // Align with SellCar and API expectation
    Fuel: string;
    Transmission: string;
    Owner: string; // Align with SellCar and API expectation
    Insurance: string[];
  };
  Features: string[];
  Highlights: string[];
}

export interface Appointment {
  Id?: string;
  Userid: string;
  Carid: string;
  Scheduleddate: string;
  Scheduledtime: string;
  Location: string;
  Appointmenttype: string;
  Status: string;
  Notes: string;
}

export interface Booking {
  Id?: string;
  Userid?: string; // Add Userid to match backend
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