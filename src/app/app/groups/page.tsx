"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import Searchbar from "@/components/Searchbar/Searchbar";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { OrgGroup } from "@/types/types";
import { getOrgGroups } from "@/services/orgGroups";
import CreateGroupModal from "@/components/Groups/CreateGroupModal";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";

export default function GroupsPage() {
  const { selectedOrgId } = useUserContext();
  const [data, setData] = useState<OrgGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();
  const { hasPrivilege } = usePrivileges();

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgGroups(selectedOrgId)
      .then((response) => setData(response.groups || []))
      .catch(() => setData([]));
  }, [selectedOrgId]);

  const filteredData = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((g) => g.name.toLowerCase().includes(q));
  }, [data, searchQuery]);

  const columns: ColumnDef<OrgGroup>[] = [
    {
      id: "name",
      header: "Group Name",
      cell: (row) => (
        <Box sx={{ py: 0.5 }}>
          <Typography variant="body2" fontWeight={600} color="#0f172a">
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      id: "member_count",
      header: "Members",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.member_count} {row.member_count === 1 ? "member" : "members"}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: "",
      width: 60,
      align: "right",
      cell: (row) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/app/groups/${row.id}`);
          }}
          sx={{ color: "#94a3b8", "&:hover": { color: "#5046e5" } }}
        >
          <ChevronRightRoundedIcon fontSize="small" />
        </IconButton>
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
            Groups
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage permission groups and roles across your organization.
          </Typography>
        </Box>

        {hasPrivilege(Privileges.CREATE_GROUPS) && (
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateOpen(true)}
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
            Create Group
          </Button>
        )}
      </Box>

      {/* Filter / Search */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Searchbar
          placeholder="Search by group name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
      </Box>

      {/* Table */}
      <Box>
        <AppTable<OrgGroup>
          data={filteredData}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(row) => router.push(`/app/groups/${row.id}`)}
        />
      </Box>

      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          if (selectedOrgId)
            getOrgGroups(selectedOrgId)
              .then((r) => setData(r.groups || []))
              .catch(() => {});
        }}
      />
    </Box>
  );
}
