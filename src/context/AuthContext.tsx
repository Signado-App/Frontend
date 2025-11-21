"use client";
import React, { createContext, useContext } from "react";

type AuthContextValue = {

};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  return <AuthContext.Provider value={
    {
        
    }
  }>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};