"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { setUnauthorizedHandler } from "@/services/apiClient";
import { AuthContextValue, OrganizationListItem, User } from "@/types/types";
import { getUser } from "@/services/user";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";
import { getUserOrganizations } from "@/services/organizations";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>(
    [],
  );

  const refreshOrganizations = async () => {
    try {
      const response = await getUserOrganizations();
      console.log("[Orgs] response:", response);

      setOrganizations(response.data);
    } catch {
      setOrganizations([]);
    }
  };

  const refresh = async () => {
    try {
      const response = await getUser();
      console.log("[Auth] getUser response:", response);
      setUser(response.data);
      await refreshOrganizations();
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

    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/verify",
      "/auth/reset-password",
    ];
    const isPublicRoute = publicRoutes.some((route) =>
      window.location.pathname.startsWith(route),
    );

    if (!isPublicRoute) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [router]);

  const login = async (accessCsrf: string, refreshCsrf: string) => {
    console.log("[Auth] Saving CSRF tokens:", accessCsrf, refreshCsrf);
    localStorage.setItem("access_csrf", accessCsrf);
    localStorage.setItem("refresh_csrf", refreshCsrf);
    await refresh();
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
        organizations,
        refreshOrganizations,
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
