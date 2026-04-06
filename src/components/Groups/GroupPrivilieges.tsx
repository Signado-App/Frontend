"use client";

import { Box, Button, Typography, Chip } from "@mui/material";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { GroupPrivilege, Privilege } from "@/types/types";

const mockPrivileges: GroupPrivilege[] = [
  {
    id: "1",
    privilegeId: "1",
    name: "view_contracts",
    description: "View all contracts",
    grantedAt: "Jan 1, 2024",
    grantedById: "1",
    expiresAt: null,
  },
  {
    id: "2",
    privilegeId: "2",
    name: "manage_contracts",
    description: "Create and edit contracts",
    grantedAt: "Jan 1, 2024",
    grantedById: "1",
    expiresAt: "Jan 15, 2025",
  },
  {
    id: "3",
    privilegeId: "3",
    name: "manage_users",
    description: "Manage organization users",
    grantedAt: "Jan 1, 2024",
    grantedById: "1",
    expiresAt: null,
  },
];

export default function GroupPrivileges({ groupId }: { groupId: string }) {
  const [privileges, setPrivileges] =
    useState<GroupPrivilege[]>(mockPrivileges);

  const columns: ColumnDef<GroupPrivilege>[] = [
    {
      id: "name",
      header: "Privilege",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.name}
        </Typography>
      ),
    },
    {
      id: "expiresAt",
      header: "Expires At",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.expiresAt ?? "Never"}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={() =>
            setPrivileges((prev) => prev.filter((p) => p.id !== row.id))
          }
        >
          Revoke
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Headline title="Privileges" size="small">
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Privilege
        </Button>
      </Headline>
      <AppTable<GroupPrivilege> data={privileges} columns={columns} />
    </Box>
  );
}
