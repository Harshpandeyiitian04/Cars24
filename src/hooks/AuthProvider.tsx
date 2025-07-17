// src/hooks/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, createUser, verifyToken, CreateUserInput, User } from "@/lib/Userapi";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: CreateUserInput) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await verifyToken(token);
          setUser(userData);
        }
      } catch (err: any) {
        console.error("AuthProvider: Token verification failed:", err.message);
        localStorage.removeItem("token");
        setError("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiLogin(email, password);
      if (!response.token || !response.user) {
        throw new Error("Invalid login response");
      }
      localStorage.setItem("token", response.token);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  const register = async (userData: CreateUserInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createUser(userData);
      if (response.success && response.data && response.data.user && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    error,
    login: handleLogin,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}