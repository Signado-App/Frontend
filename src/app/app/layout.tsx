"use client";

import React from "react";
import CompanyInfo from "@/components/SideBar/CompanyInfo";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  CssBaseline,
  Divider,
} from "@mui/material";

const SIDEBAR_WIDTH = 280;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Box
        component="aside"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "divider",
          //   backgroundColor: "palette.eggshell",
          p: 3,
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1200,
          gap: 3,
        }}
      >
        <CompanyInfo />

        <Select value="main" size="small" sx={{}}>
          <MenuItem value="main">SupplierPro Solutions (Admin View)</MenuItem>
          <MenuItem value="second">Client Account (Client View)</MenuItem>
        </Select>

        <Divider />

        <Button variant="contained" fullWidth sx={{}}>
          Create Contract
        </Button>

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: "bold",
            letterSpacing: 1,
            mb: 2,
            px: 1,
            textTransform: "uppercase",
          }}
        >
          Navigation
        </Typography>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
