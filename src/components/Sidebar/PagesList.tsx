import List from "@mui/material/List";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import React from "react";
import PagesListItem from "./PagesListItem";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";

type View = "main" | "second";

type PageItem = {
  href: string;
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  views: View[];
};

const pages: PageItem[] = [
  {
    href: "/app/dashboard",
    icon: <GridViewIcon fontSize="small" />,
    primary: "Dashboard",
    secondary: "Overview & metrics",
    views: ["main", "second"],
  },
  {
    href: "/app/clients",
    icon: <PeopleOutlineIcon fontSize="small" />,
    primary: "Clients",
    secondary: "Client management",
    views: ["second"],
  },
  {
    href: "/app/contracts",
    icon: <EditNoteIcon fontSize="small" />,
    primary: "Contracts",
    secondary: "Contracts & agreements",
    views: ["main", "second"],
  },
  {
    href: "/app/invoices",
    icon: <LocalAtmIcon fontSize="small" />,
    primary: "Invoices",
    secondary: "Payments & billing",
    views: ["second"],
  },
  {
    href: "/app/reports",
    icon: <BarChartIcon fontSize="small" />,
    primary: "Reports",
    secondary: "Analytics & trends",
    views: ["second"],
  },
  {
    href: "/app/notifications",
    icon: <NotificationsNoneIcon fontSize="small" />,
    primary: "Notifications",
    secondary: "Alerts & messages",
    views: ["main", "second"],
  },
  {
    href: "/app/settings",
    icon: <SettingsIcon fontSize="small" />,
    primary: "Settings",
    secondary: "Account & company",
    views: ["main", "second"],
  },
];

export default function PagesList({ view }: { view: View }) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {pages
        .filter((page) => page.views.includes(view))
        .map((page) => (
          <PagesListItem key={page.href} {...page} />
        ))}
    </List>
  );
}
