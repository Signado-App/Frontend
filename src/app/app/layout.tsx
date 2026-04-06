"use client";

import React from "react";
import { Box, CssBaseline } from "@mui/material";

import Sidebar from "@/components/Sidebar/Sidebar";

const SIDEBAR_WIDTH = 280;

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
