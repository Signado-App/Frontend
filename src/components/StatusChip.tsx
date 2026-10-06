"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

interface StatusConfig {
  label: string;
  bg: string;
  color: string;
  icon?: React.ReactNode;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Client statuses
  active: {
    label: "Active",
    bg: "#dcfce7",
    color: "#15803d",
    icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },
  disabled: {
    label: "Disabled",
    bg: "#f1f5f9",
    color: "#64748b",
  },
  invited: {
    label: "Invited",
    bg: "#fef3c7",
    color: "#b45309",
    icon: <AccessTimeRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },

  // Contract statuses
  signed: {
    label: "Completed",
    bg: "#dcfce7",
    color: "#15803d",
    icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },
  completed: {
    label: "Completed",
    bg: "#dcfce7",
    color: "#15803d",
    icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },
  pending_signatures: {
    label: "Awaiting signature",
    bg: "#f1f5f9",
    color: "#475569",
    icon: <AccessTimeRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },
  waiting_for_files: {
    label: "Needs action",
    bg: "#fef3c7",
    color: "#92400e",
    icon: <ErrorOutlineRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },
  needs_action: {
    label: "Needs action",
    bg: "#fef3c7",
    color: "#92400e",
    icon: <ErrorOutlineRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },
  draft: {
    label: "Draft",
    bg: "#f1f5f9",
    color: "#64748b",
    icon: <EditNoteRoundedIcon sx={{ fontSize: "0.85rem" }} />,
  },
  expired: {
    label: "Expired",
    bg: "#f1f5f9",
    color: "#64748b",
  },
  cancelled: {
    label: "Cancelled",
    bg: "#fee2e2",
    color: "#b91c1c",
  },
};

export default function StatusChip({ status }: { status?: string }) {
  if (!status) return null;

  const key = status.toLowerCase();
  const config = STATUS_MAP[key] || {
    label: status.replace(/_/g, " "),
    bg: "#f1f5f9",
    color: "#475569",
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: 1.2,
        py: 0.4,
        borderRadius: "9999px",
        bgcolor: config.bg,
        color: config.color,
        fontSize: "0.78rem",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        width: "fit-content",
      }}
    >
      {config.icon}
      <Typography
        component="span"
        sx={{
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "inherit",
          lineHeight: 1.2,
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
}
