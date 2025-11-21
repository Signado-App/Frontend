"use client";
import React, { createContext, useContext } from "react";

type UserContextValue = {

};

const UserContext = createContext<UserContextValue | undefined>(undefined);
type UserContextProviderProps = {
  children: React.ReactNode;
};

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  return <UserContext.Provider value={
    {
        
    }
  }>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};