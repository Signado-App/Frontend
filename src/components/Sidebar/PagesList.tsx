import List from "@mui/material/List";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import React from "react";
import PagesListItem from "./PagesListItem";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import { Mode, PageItem, Privilege } from "@/types/types";
import { usePrivileges } from "@/context/PrivilegesContext";



const pages: PageItem[] = [
  {
    href: "/app/dashboard",
    icon: <GridViewIcon fontSize="small" />,
    primary: "Dashboard",
    secondary: "Overview & metrics",
    modes: ["client", "organization"],
  },
  {
    href: "/app/clients",
    icon: <PeopleOutlineIcon fontSize="small" />,
    primary: "Clients",
    secondary: "Client management",
    modes: ["organization"],
  },
  {
    href: "/app/users",
    icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    primary: "Users",
    secondary: "Organization users",
    modes: ["organization"],
  },
  {
    href: "/app/groups",
    icon: <GroupsOutlinedIcon fontSize="small" />,
    primary: "Groups",
    secondary: "Groups within organization",
    modes: ["organization"],
  },
  {
    href: "/app/contracts",
    icon: <EditNoteIcon fontSize="small" />,
    primary: "Contracts",
    secondary: "Contracts & agreements",
    modes: ["client", "organization"],
  },
  // {
  //   href: "/app/invoices",
  //   icon: <LocalAtmIcon fontSize="small" />,
  //   primary: "Invoices",
  //   secondary: "Payments & billing",
  //   views: ["second"],
  // },
  // {
  //   href: "/app/reports",
  //   icon: <BarChartIcon fontSize="small" />,
  //   primary: "Reports",
  //   secondary: "Analytics & trends",
  //   views: ["second"],
  // },
  {
    href: "/app/notifications",
    icon: <NotificationsNoneIcon fontSize="small" />,
    primary: "Notifications",
    secondary: "Alerts & messages",
    modes: ["client", "organization"],
  },
  {
    href: "/app/settings",
    icon: <SettingsIcon fontSize="small" />,
    primary: "Settings",
    secondary: "Account & company",
    modes: ["client", "organization"],
  },
];

export default function PagesList({ mode }: { mode: Mode }) {
  const { hasPrivilege } = usePrivileges();

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {pages
        .filter((page) => page.modes.includes(mode))
        .filter((page) => !page.privilege || hasPrivilege(page.privilege))
        .map((page) => (
          <PagesListItem key={page.href} {...page} />
        ))}
    </List>
  );
}
