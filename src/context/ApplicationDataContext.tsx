"use client";
import React, { createContext, useContext } from "react";

type ApplicationDataContextValue = {

};

const ApplicationDataContext = createContext<ApplicationDataContextValue | undefined>(undefined);
type ApplicationDataContextProviderProps = {
  children: React.ReactNode;
};

export const ApplicationDataContextProvider: React.FC<ApplicationDataContextProviderProps> = ({
  children,
}) => {
  return <ApplicationDataContext.Provider value={
    {
        
    }
  }>{children}</ApplicationDataContext.Provider>;
};

export const useApplicationDataContext = () => {
  const context = useContext(ApplicationDataContext);
  if (context === undefined) {
    throw new Error("useApplicationDataContext must be used within a ApplicationDataContextProvider");
  }
  return context;
};