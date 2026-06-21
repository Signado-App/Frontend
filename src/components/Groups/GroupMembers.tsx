"use client";

import { Box, Button, Typography } from "@mui/material";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type GroupMember = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type Props = {
  groupId: string;
  members: GroupMember[];
  onAdd: () => void;
  onRemove: (userId: number) => void;
};

export default function GroupMembers({
  groupId,
  members,
  onAdd,
  onRemove,
}: Props) {
  const columns: ColumnDef<GroupMember>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.first_name} {row.last_name}
        </Typography>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.email}
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
          onClick={() => onRemove(row.user_id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Headline title="Members" size="small">
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
          Add Member
        </Button>
      </Headline>
      <AppTable<GroupMember>
        data={members ?? []}
        columns={columns}
        getRowId={(row) => row.user_id}
      />
    </Box>
  );
}
