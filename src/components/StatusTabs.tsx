"use client";

import React from "react";
import { Box, Button } from "@mui/material";

interface StatusTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  Tabs: string[];
}

export default function StatusTabs({
  currentTab,
  onTabChange,
  Tabs,
}: StatusTabsProps) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        flexWrap: "wrap",
        bgcolor: "transparent",
        p: 0,
        gap: 1,
      }}
    >
      {Tabs.map((tab) => {
        const isActive = currentTab === tab;

        return (
          <Button
            key={tab}
            onClick={() => onTabChange(tab)}
            disableRipple
            sx={{
              textTransform: "none",
              fontWeight: isActive ? 600 : 500,
              fontSize: "0.875rem",
              borderRadius: "20px",
              px: 2.2,
              py: 0.7,
              minWidth: "unset",
              color: isActive ? "#ffffff" : "#64748b",
              bgcolor: isActive ? "#5046e5" : "transparent",
              boxShadow: isActive ? "0px 2px 4px rgba(80, 70, 229, 0.2)" : "none",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: isActive ? "#4338ca" : "rgba(0, 0, 0, 0.05)",
                color: isActive ? "#ffffff" : "#1e293b",
              },
            }}
          >
            {tab}
          </Button>
        );
      })}
    </Box>
  );
}
