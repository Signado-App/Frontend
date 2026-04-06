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
        bgcolor: "#f3f4f6",
        p: "4px",
        borderRadius: "10px",
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
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "8px",
              px: 3,
              minWidth: "100px",
              color: isActive ? "text.primary" : "text.secondary",
              bgcolor: isActive ? "#ffffff" : "transparent",
              boxShadow: isActive ? "0px 1px 2px rgba(0,0,0,0.1)" : "none",

              "&:hover": {
                bgcolor: isActive ? "#ffffff" : "rgba(0,0,0,0.04)",
                color: "text.primary",
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
