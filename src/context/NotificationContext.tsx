"use client";
import React, { createContext, useContext } from "react";

type NotificationContextValue = {

};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);
type NotificationContextProviderProps = {
  children: React.ReactNode;
};

export const NotificationContextProvider: React.FC<NotificationContextProviderProps> = ({
  children,
}) => {
  return <NotificationContext.Provider value={
    {
        
    }
  }>{children}</NotificationContext.Provider>;
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotificationContext must be used within a NotificationContextProvider");
  }
  return context;
};