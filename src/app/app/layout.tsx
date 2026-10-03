"use client";

import React, { useEffect } from "react";
import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar/Sidebar";

const SIDEBAR_WIDTH = 280;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          p: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
