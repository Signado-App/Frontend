import List from "@mui/material/List";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import React from "react";
import PagesListItem from "./PagesListItem";

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
    </List>
  );
}
