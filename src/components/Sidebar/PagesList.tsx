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

export default function PagesList() {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <PagesListItem
        href="/app/dashboard"
        icon={<GridViewIcon fontSize="small" />}
        primary="Dashboard"
        secondary="Overview & metrics"
      />

      <PagesListItem
        href="/app/clients"
        icon={<PeopleOutlineIcon fontSize="small" />}
        primary="Clients"
        secondary="Client management"
      />

      <PagesListItem
        href="/app/contracts"
        icon={<EditNoteIcon fontSize="small" />}
        primary="Contracts"
        secondary="Contracts & agreements"
      />

      <PagesListItem
        href="/app/dashboard"
        icon={<LocalAtmIcon fontSize="small" />}
        primary="Invoices"
        secondary="Payments & billing"
      />

      <PagesListItem
        href="/app/dashboard"
        icon={<BarChartIcon fontSize="small" />}
        primary="Reports"
        secondary="Analytics & trends"
      />

      <PagesListItem
        href="/app/dashboard"
        icon={<NotificationsNoneIcon fontSize="small" />}
        primary="Notifications"
        secondary="Alerts & messages"
      />

      <PagesListItem
        href="/app/dashboard"
        icon={<SettingsIcon fontSize="small" />}
        primary="Settings"
        secondary="Account & company"
      />
    </List>
  );
}
