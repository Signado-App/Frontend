"use client";

import { Box, Typography, Paper } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  value: number | string;
};

export default function StatCard({ icon, label, value }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, flex: 1, display: "flex", alignItems: "center", gap: 2 }}
    >
      <Box sx={{ color: "primary.main" }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
