"use client";
import { Avatar, Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export default function CompanyInfo({}) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
      <Avatar
        variant="rounded"
        sx={{ bgcolor: "#000", color: "#fff", borderRadius: "8px" }}
      >
        S
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
          Signado
        </Typography>
        <Typography variant="caption" color="text.secondary">
          B2B Services Platform
        </Typography>
      </Box>
    </Box>
  );
}
