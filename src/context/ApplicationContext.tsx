"use client";
import React, { createContext, useContext } from "react";

type ApplicationContextValue = {

};

const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined);
type ApplicationContextProviderProps = {
  children: React.ReactNode;
};

export const ApplicationContextProvider: React.FC<ApplicationContextProviderProps> = ({
  children,
}) => {
  return <ApplicationContext.Provider value={
    {
        
    }
  }>{children}</ApplicationContext.Provider>;
};

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error("useApplicationContext must be used within a ApplicationContextProvider");
  }
  return context;
};