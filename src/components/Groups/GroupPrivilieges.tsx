"use client";

import { Box, Button, Typography } from "@mui/material";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type GroupPrivilegeItem = {
  id: number;
  name: string;
  description?: string;
};

type Props = {
  groupId: string;
  privileges: GroupPrivilegeItem[];
};

export default function GroupPrivileges({ groupId, privileges }: Props) {
  const columns: ColumnDef<GroupPrivilegeItem>[] = [
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
      id: "description",
      header: "Description",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.description ?? "-"}
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
          onClick={() => {
            /* TODO: revoke */
          }}
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
      <AppTable<GroupPrivilegeItem>
        data={privileges ?? []}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
