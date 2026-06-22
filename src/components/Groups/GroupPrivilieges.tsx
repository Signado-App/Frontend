"use client";

import { Box, Button, Typography } from "@mui/material";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

type GroupPrivilegeItem = {
  id: number;
  name: string;
  description?: string;
};

type Props = {
  groupId: string;
  privileges: GroupPrivilegeItem[];
  onEdit: () => void;
};

export default function GroupPrivileges({
  groupId,
  privileges,
  onEdit,
}: Props) {
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
  ];

  return (
    <Box>
      <Headline title="Privileges" size="small">
        <Button
          variant="contained"
          startIcon={<EditOutlinedIcon />}
          onClick={onEdit}
        >
          Edit Privileges
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
