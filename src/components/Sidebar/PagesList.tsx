import List from "@mui/material/List";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import React from "react";
import PagesListItem from "./PagesListItem";
import SettingsIcon from "@mui/icons-material/Settings";
import { Mode, PageItem, Privilege } from "@/types/types";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";

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
    privilege: Privileges.SEE_ALL_CLIENTS,
  },
  {
    href: "/app/users",
    icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    primary: "Users",
    secondary: "Organization users",
    modes: ["organization"],
    privilege: Privileges.USERS_ACCESSIBLE,
  },
  {
    href: "/app/groups",
    icon: <GroupsOutlinedIcon fontSize="small" />,
    primary: "Groups",
    secondary: "Groups within organization",
    modes: ["organization"],
    privilege: Privileges.GROUPS_ACCESSIBLE,
  },
  {
    href: "/app/contracts",
    icon: <EditNoteIcon fontSize="small" />,
    primary: "Contracts",
    secondary: "Contracts & agreements",
    modes: ["client", "organization"],
  },
  {
    href: "/app/settings",
    icon: <SettingsIcon fontSize="small" />,
    primary: "Settings",
    secondary: "Account settings",
    modes: ["client"],
  },
  {
    href: "/app/settings",
    icon: <SettingsIcon fontSize="small" />,
    primary: "Settings",
    secondary: "Organization & account",
    modes: ["organization"],
    privilege: Privileges.ADMIN_UPDATE,
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
