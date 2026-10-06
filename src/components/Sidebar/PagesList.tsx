"use client";

import React from "react";
import List from "@mui/material/List";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PagesListItem from "./PagesListItem";
import { Mode, PageItem } from "@/types/types";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";

const pages: PageItem[] = [
  {
    href: "/app/dashboard",
    icon: <GridViewRoundedIcon />,
    primary: "Dashboard",
    secondary: "Overview & metrics",
    modes: ["client", "organization"],
  },
  {
    href: "/app/clients",
    icon: <PeopleOutlineRoundedIcon />,
    primary: "Clients",
    secondary: "Client management",
    modes: ["organization"],
    privilege: Privileges.SEE_ALL_CLIENTS,
  },
  {
    href: "/app/contracts",
    icon: <EditNoteRoundedIcon />,
    primary: "Contracts",
    secondary: "Contracts & agreements",
    modes: ["client", "organization"],
  },
  {
    href: "/app/users",
    icon: <PersonOutlineRoundedIcon />,
    primary: "Team",
    secondary: "Organization users",
    modes: ["organization"],
    privilege: Privileges.USERS_ACCESSIBLE,
  },
  {
    href: "/app/groups",
    icon: <GroupsOutlinedIcon />,
    primary: "Groups",
    secondary: "Groups & privileges",
    modes: ["organization"],
    privilege: Privileges.GROUPS_ACCESSIBLE,
  },
  {
    href: "/app/settings",
    icon: <SettingsOutlinedIcon />,
    primary: "Settings",
    secondary: "Account settings",
    modes: ["client"],
  },
  {
    href: "/app/settings",
    icon: <SettingsOutlinedIcon />,
    primary: "Settings",
    secondary: "Organization settings",
    modes: ["organization"],
    privilege: Privileges.ADMIN_UPDATE,
  },
];

export default function PagesList({
  mode,
  isCollapsed = false,
}: {
  mode: Mode;
  isCollapsed?: boolean;
}) {
  const { hasPrivilege } = usePrivileges();

  const filteredPages = pages
    .filter((page) => page.modes.includes(mode))
    .filter((page) => !page.privilege || hasPrivilege(page.privilege));

  return (
    <List sx={{ width: "100%", p: 0 }}>
      {filteredPages.map((page, index) => (
        <PagesListItem
          key={`${page.href}-${index}`}
          {...page}
          isCollapsed={isCollapsed}
        />
      ))}
    </List>
  );
}
