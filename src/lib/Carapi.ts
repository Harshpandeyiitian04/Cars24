// src/lib/Carapi.ts
export const BASE_URL = "http://localhost:5083/api/Car";

export interface Cardetails {
  Title: string;
  Images: string[];
  Price: string;
  Emi: string;
  Status: string; // Ensure status field exists
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
}

export interface Car extends Cardetails {
  Id?: string;
}

export async function createcar(data: any) {
  // Helper function to convert UUID to 24-character hexadecimal string
  const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 24, dictionary: 'hex' });
const randomHex = uid.rnd();
console.log(randomHex);

  // Validate input data
  if (!data || !data.car) {
    throw new Error("Invalid input: car data is required");
  }

  // Log input Id for debugging
  console.log("Input car.Id:", data.car.Id);

  // Transform data to match server expectations
  const transformedData = {
    car: {
      ...data.car,
      Id: randomHex, // Convert UUID to ObjectId format
      Specs: {
        ...data.car.Specs,
        Owner: data.car.Specs?.Owner?.[0] || "", // Convert array to string, handle undefined
        Insurance: data.car.Specs?.Insurance?.[0] || "", // Convert array to string, handle undefined
      },
    },
  };

  // Log the final payload before sending
  console.log("Transformed Payload:", JSON.stringify(transformedData, null, 2));

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include Authorization header if required by the endpoint
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(transformedData),
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        const errorText = await response.text();
        console.error("Non-JSON response:", errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.slice(0, 100)}`);
      }
      console.log("Response Status:", response.status);
      console.log("Error Data:", errorData);
      throw new Error(errorData.message || "Failed to create car");
    }
    const result = await response.json();
    console.log("API Response:", result);
    return result;
  } catch (error: any) {
    console.error("API Error:", error.message);
    throw error;
  }
}

export const getcarbyid = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Response Status:", response.status);
      console.log("Error Data:", errorData);
      throw new Error(errorData.message || "Failed to fetch car");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching car with id ${id}:`, error);
    throw error;
  }
};

export const getcarsummaries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/summaries`, {
      method: "POST",
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Response Status:", response.status);
      console.log("Error Data:", errorData);
      throw new Error(errorData.message || "Failed to fetch car summaries");
    }
    return await response.json();
    console.log(response.json())
  } catch (error) {
    console.error("Error fetching car summaries:", error);
    return [];
  }
};