// src/lib/Userapi.ts
import ShortUniqueId from 'short-unique-id';

// Initialize short-unique-id with hex dictionary and 24-character length
const uid = new ShortUniqueId({ length: 24, dictionary: 'hex' });

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone: string;
}

export interface CreateUserInput {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

export async function verifyToken(token: string): Promise<User> {
  try {
    const response = await fetch("http://localhost:5083/api/Usersauth/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to verify token";
      if (response.status === 401) {
        errorMessage = "Invalid or expired token";
      } else {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error("Non-JSON response:", errorText);
        }
      }
      console.log("Response Status:", response.status);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.user || !data.user.id) {
      throw new Error("Invalid user data: No user ID returned");
    }

    return data.user ;
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  try {
    const response = await fetch("http://localhost:5083/api/Usersauth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return { token: data.token, user: data.user };
  } catch (error: any) {
    console.error("Login failed:", error.message);
    throw error;
  }
}

export async function createUser(userData: CreateUserInput): Promise<{
  success: boolean;
  message?: string;
  data?: { user: User; token: string };
}> {
  try {
    // Generate a 24-character hex ID
    const userId = uid.rnd();
    console.log('Generated User ID:', userId);

    // Validate ID format
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      throw new Error(`Invalid User ID format: ${userId}`);
    }

    const response = await fetch("http://localhost:5083/api/Usersauth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Id: userId,
        Fullname: userData.fullname,
        Email: userData.email,
        Phone: userData.phone,
        Password: userData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return {
      success: true,
      data: { user: data.user, token: data.token },
    };
  } catch (error: any) {
    console.error("Registration failed:", error.message);
    return { success: false, message: error.message };
  }
}