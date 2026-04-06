"use client";
import React, { createContext, useContext, useState } from "react";

type Mode = "client" | "organization";

type UserContextValue = {
  mode: Mode;
  selectedOrgId: number | null;
  setMode: (mode: Mode, orgId: number | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<Mode>("client");
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const setMode = (mode: Mode, orgId: number | null) => {
    setModeState(mode);
    setSelectedOrgId(orgId);
  };

  return (
    <UserContext.Provider value={{ mode, selectedOrgId, setMode }}>
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