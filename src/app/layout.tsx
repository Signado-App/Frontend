import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.scss";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { UserContextProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/themeProvider/ThemeContext";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { PrivilegesProvider } from "@/context/PrivilegesContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Signado · Podklady, schválení i podpis od klienta jedním odkazem",
  description:
    "Jeden odkaz na všechno, co od klienta potřebujete. Klient vyplní bez účtu z telefonu, vy kontrolujete po položkách. Pro účetní, výrobu a advokáty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} ${plusJakartaSans.variable} ${inter.variable}`}>
        <ThemeProvider>
          <SnackbarProvider>
            <LanguageContextProvider>
              <AuthContextProvider>
                <UserContextProvider>
                  <PrivilegesProvider>{children}</PrivilegesProvider>
                </UserContextProvider>
              </AuthContextProvider>
            </LanguageContextProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
