import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";

type PagesListItemProps = {
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  href: string;
};

export default function PagesListItem({
  icon,
  primary,
  secondary,
  href,
}: PagesListItemProps) {
  const pathname = usePathname();

  const isActive = pathname.startsWith(href);

  return (
    <ListItem disablePadding>
      <ListItemButton
        LinkComponent={Link}
        href={href}
        selected={isActive}
        sx={{
          borderRadius: "8px",
          mb: 0.5,
          "&.Mui-selected": {
            bgcolor: "#f3f4f6",
            "&:hover": { bgcolor: "#e5e7eb" },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: "40px",
            color: "text.primary",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={primary}
          secondary={secondary}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: isActive ? 700 : 500,
            fontSize: "0.9rem",
          }}
          secondaryTypographyProps={{
            variant: "caption",
            fontSize: "0.75rem",
            mt: 0.3,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
