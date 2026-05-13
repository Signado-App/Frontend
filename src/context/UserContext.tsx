"use client";
import { OrganizationInfo } from "@/types/types";
import React, { createContext, useContext, useState } from "react";

type Mode = "client" | "organization";

type UserContextValue = {
  mode: Mode;
  selectedOrgId: number | null;
  selectedOrg: OrganizationInfo | null;
  setMode: (
    mode: Mode,
    orgId: number | null,
    org?: OrganizationInfo | null,
  ) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<Mode>("client");
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectedOrg, setSelectedOrgState] = useState<OrganizationInfo | null>(
    null,
  );

  const setMode = (
    mode: Mode,
    orgId: number | null,
    org?: OrganizationInfo | null,
  ) => {
    setModeState(mode);
    setSelectedOrgId(orgId);
    setSelectedOrgState(org ?? null);
  };

  return (
    <UserContext.Provider value={{ mode, selectedOrgId, selectedOrg, setMode }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
