// src/lib/Appointment.ts
const BASE_URL = "http://localhost:5083/api/Appointment";

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

export interface CarDetails {
  Id: string;
  Title: string;
  Price: string;
  Emi: string;
  Location: string;
}

export interface AppointmentDto {
  Appointment: Appointment | null;
  Car: CarDetails | null;
}

export const createappointment = async (
  userId: string,
  carId: string,
  appointmentData: Omit<Appointment, 'Id' | 'Userid' | 'Carid' | 'Status'>
): Promise<Appointment> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  // Validate input data
  if (!appointmentData.Scheduleddate || !appointmentData.Scheduledtime || !appointmentData.Location) {
    throw new Error("Scheduleddate, Scheduledtime, and Location are required");
  }

  // Validate userId and carId format
  if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
    throw new Error(`Invalid Userid format: ${userId}`);
  }
  if (!/^[0-9a-fA-F]{24}$/.test(carId)) {
    throw new Error(`Invalid Carid format: ${carId}`);
  }

  // Construct payload with wrapper
  const payload = {
    appointment: {
      ...appointmentData,
      Userid: userId,
      Carid: carId,
      Status: "upcoming",
    },
  };

  console.log("Appointment Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/create/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Server error: ${response.status}`;
      let errorData;

      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
        errorMessage = errorData.message || `Server error: ${response.status}`;
      } else {
        const errorText = await response.text();
        console.error("Non-JSON response:", errorText);
        errorMessage = `${errorMessage} - ${errorText.slice(0, 100)}`;
      }

      console.log("Response Status:", response.status);
      console.log("Error Data:", errorData || errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("API Response:", result);
    return result as Appointment;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getapppointmentbyuser = async (userid: string): Promise<AppointmentDto[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!/^[0-9a-fA-F]{24}$/.test(userid)) {
      throw new Error(`Invalid Userid format: ${userid}`);
    }

    const response = await fetch(`${BASE_URL}/user/${userid}/appointments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Server error: ${response.status}`;
      let errorData;

      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
        errorMessage = errorData.message || `Server error: ${response.status}`;
      } else {
        const errorText = await response.text();
        console.error("Non-JSON response:", errorText);
        errorMessage = `${errorMessage} - ${errorText.slice(0, 100)}`;
      }

      console.log("Response Status:", response.status);
      console.log("Error Data:", errorData || errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Enhanced validation that properly checks the data structure
    const validAppointments = data.filter((dto: any) => {
      // Check for both possible property name cases
      const appointment = dto.Appointment || dto.appointment;
      const car = dto.Car || dto.car;
      
      // Validate required appointment fields (checking both cases)
      const hasValidAppointment = appointment && 
        (appointment.Id || appointment.id) && 
        (appointment.Userid || appointment.userid) &&
        (appointment.Carid || appointment.carid) &&
        appointment.scheduleddate &&
        appointment.scheduledtime;
      
      // Validate required car fields (checking both cases)
      const hasValidCar = car && 
        (car.Id || car.id) &&
        car.title &&
        car.price;

      if (!hasValidAppointment || !hasValidCar) {
        console.warn("Invalid AppointmentDto - Missing required fields:", {
          appointmentMissingId: !(appointment?.Id || appointment?.id),
          appointmentMissingUserId: !(appointment?.Userid || appointment?.userid),
          appointmentMissingCarId: !(appointment?.Carid || appointment?.carid),
          appointmentMissingDate: !appointment?.scheduleddate,
          appointmentMissingTime: !appointment?.scheduledtime,
          carMissingId: !(car?.Id || car?.id),
          carMissingTitle: !car?.title,
          carMissingPrice: !car?.price,
          rawData: dto
        });
        return false;
      }
      
      return true;
    });

    // Normalize the data structure to match our DTO format
    const normalizedAppointments = validAppointments.map((dto: any) => ({
      Appointment: {
        Id: dto.Appointment?.Id || dto.appointment?.id,
        Userid: dto.Appointment?.Userid || dto.appointment?.userid,
        Carid: dto.Appointment?.Carid || dto.appointment?.carid,
        Scheduleddate: dto.Appointment?.Scheduleddate || dto.appointment?.scheduleddate,
        Scheduledtime: dto.Appointment?.Scheduledtime || dto.appointment?.scheduledtime,
        Location: dto.Appointment?.Location || dto.appointment?.location,
        Appointmenttype: dto.Appointment?.Appointmenttype || dto.appointment?.appointmenttype,
        Status: dto.Appointment?.Status || dto.appointment?.status,
        Notes: dto.Appointment?.Notes || dto.appointment?.notes
      },
      Car: {
        Id: dto.Car?.Id || dto.car?.id,
        Title: dto.Car?.Title || dto.car?.title,
        Price: dto.Car?.Price || dto.car?.price,
        Emi: dto.Car?.Emi || dto.car?.emi,
        Location: dto.Car?.Location || dto.car?.location
      }
    }));

    console.log("Validation Results:", {
      totalReceived: data.length,
      validCount: normalizedAppointments.length,
      invalidCount: data.length - normalizedAppointments.length,
      sampleValid: normalizedAppointments.length > 0 ? normalizedAppointments[0] : null
    });

    return normalizedAppointments as AppointmentDto[];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};