"use client";

import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PagesList from "./PagesList";
import CompanyInfo from "./CompanyInfo";

const SIDEBAR_WIDTH = 280;

export default function Sidebar() {
  return (
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
        // backgroundColor: "palette.eggshell",
        p: 3,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        gap: 3,
        bgcolor: "background.paper",
      }}
    >
      <CompanyInfo />

      <Select value="main" size="small" sx={{}}>
        <MenuItem value="main">SupplierPro Solutions (Admin View)</MenuItem>
        <MenuItem value="second">Client Account (Client View)</MenuItem>
      </Select>

      <Divider />

      <Button variant="contained" fullWidth sx={{}} startIcon={<AddIcon />}>
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
      <PagesList />
    </Box>
  );
}
