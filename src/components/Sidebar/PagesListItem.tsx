"use client";

import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Tooltip from "@mui/material/Tooltip";
import { usePathname } from "next/navigation";
import Link from "next/link";

export type PagesListItemProps = {
  icon: React.ReactNode;
  primary: string;
  secondary?: string;
  href: string;
  isCollapsed?: boolean;
};

export default function PagesListItem({
  icon,
  primary,
  href,
  isCollapsed = false,
}: PagesListItemProps) {
  const pathname = usePathname();

  // Active if pathname matches exactly or starts with href/ (except /app/dashboard)
  const isActive =
    href === "/app/dashboard"
      ? pathname === "/app/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);

  const buttonContent = (
    <ListItemButton
      LinkComponent={Link}
      href={href}
      selected={isActive}
      sx={{
        borderRadius: "12px",
        mb: 0.8,
        px: isCollapsed ? 0 : 1.5,
        py: 1,
        width: isCollapsed ? 44 : "100%",
        height: isCollapsed ? 44 : 42,
        mx: isCollapsed ? "auto" : 0,
        justifyContent: isCollapsed ? "center" : "flex-start",
        color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.78)",
        bgcolor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
        transition: "all 0.15s ease-in-out",
        "&.Mui-selected": {
          bgcolor: "rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.26)",
          },
        },
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          "& .MuiListItemIcon-root": {
            color: "#ffffff",
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: isCollapsed ? "unset" : "36px",
          color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.78)",
          justifyContent: "center",
          transition: "color 0.15s ease",
          "& svg": {
            fontSize: "1.25rem",
          },
        }}
      >
        {icon}
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText
          primary={primary}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.92rem",
            color: "inherit",
            noWrap: true,
          }}
        />
      )}
    </ListItemButton>
  );

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      {isCollapsed ? (
        <Tooltip title={primary} placement="right" arrow>
          {buttonContent}
        </Tooltip>
      ) : (
        buttonContent
      )}
    </ListItem>
  );
}
