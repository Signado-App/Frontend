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
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

const SIDEBAR_WIDTH = 280;

export default function Sidebar() {
  const [view, setView] = React.useState<"main" | "second">("main");

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e5e7eb",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        p: 3,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        gap: 2,
        bgcolor: "background.paper",
      }}
    >
      <CompanyInfo />

      <Select
        value={view}
        size="small"
        onChange={(e) => setView(e.target.value as "main" | "second")}
      >
        <MenuItem value="main">Client Account</MenuItem>
        <MenuItem value="second">Organization Account</MenuItem>
      </Select>

      {view === "main" && (
        <Button
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
          }}
          startIcon={<BusinessOutlinedIcon />}
        >
          Create Organization
        </Button>
      )}

      <Divider />

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
        }}
        startIcon={<AddIcon />}
      >
        Create Contract
      </Button>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: "bold",
          letterSpacing: 1,
          // px: 1,
          textTransform: "uppercase",
        }}
      >
        Navigation
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <PagesList view={view} />
      </Box>
    </Box>
  );
}
