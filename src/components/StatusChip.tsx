// src/components/StatusChip.tsx
"use client";

import Chip from "@mui/material/Chip";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  // general
  active: { bg: "#dcfce7", text: "#22c55e" },
  invited: { bg: "#fef9c3", text: "#eab308" },
  disabled: { bg: "#f3f4f6", text: "#64748b" },
  // contracts
  draft: { bg: "#fef9c3", text: "#eab308" },
  pending_signatures: { bg: "#e0f2fe", text: "#0ea5e9" },
  waiting_for_files: { bg: "#fef3c7", text: "#f59e0b" },
  signed: { bg: "#dcfce7", text: "#22c55e" },
  completed: { bg: "#dcfce7", text: "#22c55e" },
  expired: { bg: "#f3f4f6", text: "#64748b" },
  cancelled: { bg: "#fee2e2", text: "#ef4444" },
};

export default function StatusChip({ status }: { status: string }) {
  const style = STATUS_COLORS[status?.toLowerCase()] ?? {
    bg: "#f3f4f6",
    text: "#64748b",
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.text,
        fontWeight: 600,
        borderRadius: "6px",
        height: "24px",
        fontSize: "0.75rem",
      }}
    />
  );
}
