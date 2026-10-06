"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Select,
  MenuItem,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import StatusTabs from "@/components/StatusTabs";
import StatusChip from "@/components/StatusChip";
import Searchbar from "@/components/Searchbar/Searchbar";
import InviteUserModal from "@/components/Users/InviteUserModal";
import EditUserPrivilegesModal from "@/components/Users/EditUserPrivilegesModal";
import { OrgMember } from "@/types/types";
import { useUserContext } from "@/context/UserContext";
import { getOrgUsers, removeOrgUser } from "@/services/orgUsers";
import { useAuthContext } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";

export default function UsersPage() {
  const [currentTab, setCurrentTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { selectedOrgId } = useUserContext();
  const { user } = useAuthContext();
  const [data, setData] = useState<OrgMember[]>([]);
  const { showSnackbar } = useSnackbar();
  const [inviteOpen, setInviteOpen] = useState(false);
  const { hasPrivilege } = usePrivileges();
  const [editPrivilegesOpen, setEditPrivilegesOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingMemberPrivileges, setEditingMemberPrivileges] = useState<number[]>([]);

  const statusMap: Record<string, string> = {
    All: "",
    Active: "ACTIVE",
    Invited: "INVITED",
  };

  const usersList = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgUsers(selectedOrgId)
      .then((response) =>
        setData(
          Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.users)
              ? response.users
              : [],
        ),
      )
      .catch(() => setData([]));
  }, [selectedOrgId]);

  const filteredData = useMemo(() => {
    let list = [...usersList];

    // Tab filter
    if (currentTab !== "All" && statusMap[currentTab]) {
      list = list.filter((c) => c.status === statusMap[currentTab]);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }

    // Sort
    list.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`;
      const nameB = `${b.first_name} ${b.last_name}`;
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return list;
  }, [usersList, currentTab, searchQuery, sortOrder]);

  const handleRemove = async (memberId: number) => {
    if (!selectedOrgId) return;
    try {
      await removeOrgUser(selectedOrgId, memberId);
      setData((prev) => prev.filter((u) => u.member_id !== memberId));
      showSnackbar("Member removed successfully", "success");
    } catch {
      showSnackbar("Failed to remove member.", "error");
    }
  };

  const handleEditPrivileges = (row: OrgMember) => {
    setEditingMemberId(row.member_id);
    const privs = ((row as any).privileges || []).map((p: any) =>
      typeof p === "object" ? Number(p.id) : Number(p),
    );
    setEditingMemberPrivileges(privs);
    setEditPrivilegesOpen(true);
  };

  const columns: ColumnDef<OrgMember>[] = [
    {
      id: "name",
      header: "Member Name",
      cell: (row) => {
        const initials = `${row.first_name?.[0] || ""}${row.last_name?.[0] || ""}`.toUpperCase() || "U";
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#ede9fe",
                color: "#6366f1",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} color="#0f172a">
                {row.first_name} {row.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: "phone",
      header: "Phone Number",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.phone || "-"}
        </Typography>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: 140,
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {hasPrivilege(Privileges.UPDATE_USER_PRIVILEGES) && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditOutlinedIcon fontSize="small" />}
              onClick={() => handleEditPrivileges(row)}
              sx={{
                borderRadius: "8px",
                borderColor: "#e2e8f0",
                color: "#334155",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
              }}
            >
              Privileges
            </Button>
          )}
          {row.user_id !== Number(user?.id) &&
            hasPrivilege(Privileges.DELETE_USERS) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={() => handleRemove(row.member_id)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Remove
              </Button>
            )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#0f172a"
            sx={{ letterSpacing: "-0.02em" }}
          >
            Team
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage members, roles and access permissions for your organization.
          </Typography>
        </Box>

        {hasPrivilege(Privileges.ADD_USERS) && (
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setInviteOpen(true)}
            sx={{
              borderRadius: "10px",
              bgcolor: "#5046e5",
              fontWeight: 600,
              textTransform: "none",
              px: 2.2,
              py: 0.9,
              boxShadow: "0 2px 4px rgba(80, 70, 229, 0.25)",
              "&:hover": { bgcolor: "#4338ca" },
            }}
          >
            Invite Member
          </Button>
        )}
      </Box>

      {/* Filters and search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <StatusTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          Tabs={["All", "Active", "Invited"]}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Searchbar
            placeholder="Search member by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 260 } }}
          />

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            size="small"
            sx={{
              borderRadius: "10px",
              bgcolor: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#334155",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
            }}
          >
            <MenuItem value="asc">Name A-Z</MenuItem>
            <MenuItem value="desc">Name Z-A</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Table */}
      <Box>
        <AppTable<OrgMember>
          data={filteredData}
          columns={columns}
          getRowId={(row) => row.member_id}
        />
      </Box>

      {/* Modals */}
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
        currentPrivilegeIds={editingMemberPrivileges}
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
