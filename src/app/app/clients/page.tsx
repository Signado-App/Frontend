"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StatusTabs from "@/components/StatusTabs";
import Searchbar from "@/components/Searchbar/Searchbar";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import { useRouter } from "next/navigation";
import { OrgClient } from "@/types/types";
import { useUserContext } from "@/context/UserContext";
import { getOrgClients } from "@/services/orgClients";
import AddClientModal from "@/components/Organization/AddClientModal";
import { Privileges } from "@/constants/privileges";
import { usePrivileges } from "@/context/PrivilegesContext";
import StatusChip from "@/components/StatusChip";

export default function ClientsPage() {
  const router = useRouter();
  const { selectedOrgId } = useUserContext();
  const { hasPrivilege } = usePrivileges();

  const [currentTab, setCurrentTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<OrgClient[]>([]);
  const [addClientOpen, setAddClientOpen] = useState(false);

  const statusMap: Record<string, string> = {
    All: "",
    Active: "ACTIVE",
    Disabled: "DISABLED",
  };

  const clientsList = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgClients(selectedOrgId)
      .then((response) =>
        setData(
          Array.isArray(response?.clients)
            ? response.clients
            : Array.isArray(response?.data)
              ? response.data
              : [],
        ),
      )
      .catch(() => setData([]));
  }, [selectedOrgId]);

  const filteredData = useMemo(() => {
    let list = [...clientsList];

    if (currentTab !== "All" && statusMap[currentTab]) {
      list = list.filter((c) => c.status === statusMap[currentTab]);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => {
        const name = (c.client_name || "").toLowerCase();
        const email = String(c.client_metadata?.email || "").toLowerCase();
        const company = String(c.client_metadata?.company_name || "").toLowerCase();
        return name.includes(q) || email.includes(q) || company.includes(q);
      });
    }

    return list;
  }, [clientsList, currentTab, searchQuery]);

  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = ["Client Name", "Company", "Email", "Status", "Created At"];
    const rows = filteredData.map((c) => [
      `"${(c.client_name || "").replace(/"/g, '""')}"`,
      `"${String(c.client_metadata?.company_name || "").replace(/"/g, '""')}"`,
      `"${String(c.client_metadata?.email || "").replace(/"/g, '""')}"`,
      `"${c.status || ""}"`,
      `"${c.created_at || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<OrgClient>[] = [
    {
      id: "client_name",
      header: "Client & Contact Person",
      cell: (row) => (
        <Box sx={{ py: 0.5 }}>
          <Typography variant="body2" fontWeight={600} color="#0f172a">
            {row.client_name}
            {Boolean(row.client_metadata?.company_name) && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5, fontWeight: 400 }}
              >
                ({String(row.client_metadata?.company_name)})
              </Typography>
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.2 }}>
            {row.client_metadata?.email
              ? String(row.client_metadata.email)
              : (row as any).email || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: 140,
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "created_at",
      header: "Created Date",
      width: 160,
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
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
            router.push(`/app/clients/${row.id}`);
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
      {/* Page Header */}
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
          <Typography variant="h4" fontWeight={700} color="#0f172a" sx={{ letterSpacing: "-0.02em" }}>
            Clients
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Client directory and database for client relationship management.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExportCSV}
            sx={{
              borderRadius: "10px",
              color: "#334155",
              borderColor: "#e2e8f0",
              bgcolor: "#ffffff",
              fontWeight: 500,
              textTransform: "none",
              px: 2,
              py: 0.9,
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
            }}
          >
            Export CSV
          </Button>
          {hasPrivilege(Privileges.CREATE_CLIENTS) && (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setAddClientOpen(true)}
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
              New Client
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter and Search Bar */}
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
          Tabs={["All", "Active", "Disabled"]}
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Searchbar
            placeholder="Search by client or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 280 } }}
          />
        </Box>
      </Box>

      {/* Table */}
      <Box>
        <AppTable<OrgClient>
          data={filteredData}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(row) => router.push(`/app/clients/${row.id}`)}
        />
      </Box>

      {/* Add Client Modal */}
      <AddClientModal
        open={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        onSuccess={() => {
          if (selectedOrgId)
            getOrgClients(selectedOrgId)
              .then((r) => setData(r.clients || r.data || []))
              .catch(() => {});
        }}
      />
    </Box>
  );
}
