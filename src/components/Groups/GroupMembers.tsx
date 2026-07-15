"use client";

import { Box, Button, Typography } from "@mui/material";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { GroupMemberItem } from "@/types/types";
import { Privileges } from "@/constants/privileges";
import { usePrivileges } from "@/context/PrivilegesContext";

type Props = {
  groupId: string;
  members: GroupMemberItem[];
  onAdd: () => void;
  onRemove: (memberId: number) => void;
};

export default function GroupMembers({
  groupId,
  members,
  onAdd,
  onRemove,
}: Props) {
  const { hasPrivilege } = usePrivileges();

  const columns: ColumnDef<GroupMemberItem>[] = [
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
      cell: (row) =>
        hasPrivilege(Privileges.DELETE_USERS_FROM_GROUPS) ? (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onRemove(row.organization_member_id)}
          >
            Remove
          </Button>
        ) : null,
    },
  ];

  return (
    <Box>
      <Headline title="Members" size="small">
        {hasPrivilege(Privileges.ADD_USERS_TO_GROUPS) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
            Add Member
          </Button>
        )}
      </Headline>
      <AppTable<GroupMemberItem>
        data={members ?? []}
        columns={columns}
        getRowId={(row) => row.organization_member_id}
      />
    </Box>
  );
}
