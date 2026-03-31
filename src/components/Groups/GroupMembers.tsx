"use client";

import { Box, Button, Typography } from "@mui/material";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { Member } from "@/types/types";



const mockMembers: Member[] = [
  { id: "1", firstName: "Martin", lastName: "Novák", email: "martin.novak@company.com" },
  { id: "2", firstName: "Jana", lastName: "Svobodová", email: "jana.svobodova@company.com" },
];

export default function GroupMembers({ groupId }: { groupId: string }) {
  const [members, setMembers] = useState<Member[]>(mockMembers);

  const columns: ColumnDef<Member>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.firstName} {row.lastName}
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
          onClick={() => setMembers((prev) => prev.filter((m) => m.id !== row.id))}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Headline title="Members" size="small">
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Member
        </Button>
      </Headline>
      <AppTable<Member> data={members} columns={columns} />
    </Box>
  );
}