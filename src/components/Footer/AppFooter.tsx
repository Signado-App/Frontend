"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        pt: 4,
        pb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontSize: "0.78rem",
      }}
    >
      <Typography variant="caption" sx={{ color: "inherit", fontSize: "inherit" }}>
        © 2026 Signado. All rights reserved.
      </Typography>
    </Box>
  );
}
