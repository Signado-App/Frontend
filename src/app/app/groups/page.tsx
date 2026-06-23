"use client";

import { Box, Button } from "@mui/material";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Searchbar from "@/components/Searchbar/Searchbar";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { OrgGroup } from "@/types/types";
import { getOrgGroups } from "@/services/orgGroups";
import CreateGroupModal from "@/components/Groups/CreateGroupModal";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";

function GroupsPage() {
  const { selectedOrgId } = useUserContext();
  const [data, setData] = useState<OrgGroup[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();
  const { hasPrivilege } = usePrivileges();

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgGroups(selectedOrgId)
      .then((response) => setData(response.groups))
      .catch(() => setData([]));
  }, [selectedOrgId]);

  const columns: ColumnDef<OrgGroup>[] = [
    {
      id: "name",
      header: "Group Name",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.name}
        </Typography>
      ),
    },
    {
      id: "member_count",
      header: "Members",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.member_count}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outlined"
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => router.push(`/app/groups/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Groups"
          description="Manage groups within your organization."
        />
        {hasPrivilege(Privileges.CREATE_GROUPS) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Group
          </Button>
        )}
      </Box>
      <Searchbar placeholder="Search by group name" sx={{ width: 320 }} />
      <Box>
        <AppTable<OrgGroup>
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          if (selectedOrgId)
            getOrgGroups(selectedOrgId)
              .then((r) => setData(r.groups))
              .catch(() => {});
        }}
      />
    </Box>
  );
}

export default GroupsPage;
