"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next'
import i18next from "@/languages/i18n";


type LanguageContextValue = {
    getTranslation: (key: string) => string;
    getLanguage: () => string;
    setLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
type LanguageContextProviderProps = {
  children: React.ReactNode;
};

export const LanguageContextProvider: React.FC<LanguageContextProviderProps> = ({
  children,
}) => {
    //const {data} = useContext(AuthContext)

    const { t, i18n, ready} = useTranslation()

    const getTranslation = (key: string) => {
        return t(key);
    }

    const getLanguage = () => {
        return i18next.language
    }

    const setLanguage = (language: string) => {
        if (language != "en" && language != "cz"){
            i18next.changeLanguage("en")
            return
        }
        i18next.changeLanguage(language.toLocaleLowerCase())
    }

    useEffect(() => {
        setLanguage("cz")
    },  [])
    return <LanguageContext.Provider value={
        {
            getTranslation,
            getLanguage,
            setLanguage
        }
    }>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguageContext must be used within a LanguageContextProvider");
  }
  return context;
};