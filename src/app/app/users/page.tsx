"use client";

import { Box, Button } from "@mui/material";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import StatusTabs from "@/components/StatusTabs";
import { useEffect, useState } from "react";
import Searchbar from "@/components/Searchbar/Searchbar";
import { Select, MenuItem } from "@mui/material";
import AppTable from "@/components/Table/AppTable";
import { ColumnDef } from "@/components/Table/AppTable";
import Typography from "@mui/material/Typography";
import { getUsers } from "@/services/users";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { OrgMember, User } from "@/types/types";
import { useUserContext } from "@/context/UserContext";
import { getOrgUsers, removeOrgUser } from "@/services/orgUsers";
import { useAuthContext } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import InviteUserModal from "@/components/Users/InviteUserModal";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditUserPrivilegesModal from "@/components/Users/EditUserPrivilegesModal";
import StatusChip from "@/components/StatusChip";

function UsersPage() {
  const [currentTab, setCurrentTab] = useState("Active");

  const { selectedOrgId } = useUserContext();
  const { user } = useAuthContext();
  const [data, setData] = useState<OrgMember[]>([]);
  const { showSnackbar } = useSnackbar();
  const [inviteOpen, setInviteOpen] = useState(false);
  const { hasPrivilege } = usePrivileges();
  const [editPrivilegesOpen, setEditPrivilegesOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const statusMap: Record<string, string> = {
    All: "",
    Active: "ACTIVE",
    Invited: "INVITED",
  };
  const filteredData =
    currentTab === "All"
      ? data
      : data.filter((c) => c.status === statusMap[currentTab]);

  const handleRemove = async (memberId: number) => {
    if (!selectedOrgId) return;
    try {
      await removeOrgUser(selectedOrgId, memberId);
      setData((prev) => prev.filter((u) => u.member_id !== memberId));
      showSnackbar("User removed successfully", "success");
    } catch {
      showSnackbar("Failed to remove user.", "error");
    }
  };
  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgUsers(selectedOrgId)
      .then((response) => setData(response.data))
      .catch(() => setData([]));
  }, [selectedOrgId]);

  const handleEditPrivileges = (memberId: number) => {
    setEditingMemberId(memberId);
    setEditPrivilegesOpen(true);
  };
  const columns: ColumnDef<OrgMember>[] = [
    {
      id: "name",
      header: "User Name",
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
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.email}
        </Typography>
      ),
    },
    {
      id: "phone",
      header: "Phone Number",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.phone}
        </Typography>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        return <StatusChip status={row.status} />;
      },
    },

    {
      id: "actions",
      header: "Actions",
      align: "left",
      cell: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {hasPrivilege(Privileges.UPDATE_USER_PRIVILEGES) && (
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => handleEditPrivileges(row.member_id)}
            >
              Privileges
            </Button>
          )}
          {row.user_id !== Number(user?.id) &&
            hasPrivilege(Privileges.DELETE_USERS) && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => handleRemove(row.member_id)}
              >
                Remove
              </Button>
            )}
        </Box>
      ),
    },
  ];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Users"
          description="Manage clients of your organization."
        />
        {hasPrivilege(Privileges.ADD_USERS) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setInviteOpen(true)}
          >
            Invite User
          </Button>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <StatusTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          Tabs={["All", "Active", "Invited"]}
        />
        ;
        <Box sx={{ display: "flex", gap: 2 }}>
          <Searchbar placeholder="Search by client name" sx={{ width: 320 }} />
          <Select value="main" size="small" sx={{}}>
            <MenuItem value="main">Name A-Z</MenuItem>
            <MenuItem value="second">Highest value</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box>
        <AppTable<OrgMember>
          data={filteredData}
          columns={columns}
          getRowId={(row) => row.member_id}
        />
      </Box>
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => {
          if (selectedOrgId) {
            getOrgUsers(selectedOrgId)
              .then((response) => setData(response.data))
              .catch(() => {});
          }
        }}
      />
      <EditUserPrivilegesModal
        open={editPrivilegesOpen}
        memberId={editingMemberId ?? 0}
        currentPrivilegeIds={[]}
        onClose={() => setEditPrivilegesOpen(false)}
        onSuccess={() => {
          if (selectedOrgId)
            getOrgUsers(selectedOrgId)
              .then((r) => setData(r.data))
              .catch(() => {});
        }}
      />
    </Box>
  );
}

export default UsersPage;
