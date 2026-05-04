"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { setUnauthorizedHandler } from "@/services/apiClient";
import { AuthContextValue, User } from "@/types/types";
import { getUser } from "@/services/user";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = async () => {
    try {
      const response = await getUser();
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem("access_csrf");
      localStorage.removeItem("refresh_csrf");
      setUser(null);
      router.push("/auth/login");
    });

    refresh();
  }, []);

  const login = (accessCsrf: string, refreshCsrf: string) => {
    localStorage.setItem("access_csrf", accessCsrf);
    localStorage.setItem("refresh_csrf", refreshCsrf);
    refresh();
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      localStorage.removeItem("access_csrf");
      localStorage.removeItem("refresh_csrf");
      setUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};
