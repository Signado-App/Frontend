"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useRouter } from "next/navigation";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import StatusTabs from "@/components/StatusTabs";
import StatusChip from "@/components/StatusChip";
import Searchbar from "@/components/Searchbar/Searchbar";
import ContractDetailModal from "@/components/Contract/ContractDetailModal";
import { OrgContract } from "@/types/types";
import { useUserContext } from "@/context/UserContext";
import { getOrgContracts } from "@/services/orgContracts";
import { getContracts } from "@/services/contracts";
import { Privileges } from "@/constants/privileges";
import { usePrivileges } from "@/context/PrivilegesContext";
import { useAuthContext } from "@/context/AuthContext";

export default function ContractsPage() {
  const router = useRouter();
  const { selectedOrgId } = useUserContext();
  const { organizations } = useAuthContext();
  const { hasPrivilege } = usePrivileges();

  const [data, setData] = useState<OrgContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<OrgContract | null>(null);
  const [currentTab, setCurrentTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const statusMap: Record<string, string> = {
    All: "",
    Pending: "PENDING_SIGNATURES",
    Signed: "SIGNED",
    Draft: "DRAFT",
  };

  useEffect(() => {
    if (selectedOrgId) {
      getOrgContracts(selectedOrgId)
        .then((response) => {
          const list = Array.isArray(response?.contracts)
            ? response.contracts
            : Array.isArray(response?.data)
              ? response.data
              : [];
          setData(list);
        })
        .catch(() => setData([]));
    } else {
      getContracts()
        .then((response) => {
          const list: any[] = Array.isArray(response?.contracts)
            ? response.contracts
            : Array.isArray(response?.data)
              ? response.data
              : [];
          const userOrgIds = new Set(
            (organizations || []).map((o) => Number(o.organization_id)),
          );
          // In client account, only show contracts received as a client/signer,
          // not contracts created and sent on behalf of the user's organizations!
          const clientContracts = list.filter((c: any) => {
            const role = (c.role || "").toUpperCase();
            if (role === "CREATOR") return false;
            const orgId = Number(c.organization_id || c.org_id);
            if (orgId && (userOrgIds.has(orgId) || userOrgIds.size > 0)) {
              if (userOrgIds.has(orgId)) return false;
            }
            if (c.creator_member_id && userOrgIds.size > 0) return false;
            return true;
          });
          setData(clientContracts);
        })
        .catch(() => setData([]));
    }
  }, [selectedOrgId, organizations]);

  const contractsList = Array.isArray(data) ? data : [];

  const filteredData = useMemo(() => {
    let list = [...contractsList];

    if (currentTab !== "All" && statusMap[currentTab]) {
      list = list.filter((c) => c.status === statusMap[currentTab]);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)),
      );
    }

    if (sortBy === "newest") {
      list.sort((a, b) => {
        const da = a.last_activity || a.created_at || "";
        const db = b.last_activity || b.created_at || "";
        return db.localeCompare(da);
      });
    } else if (sortBy === "oldest") {
      list.sort((a, b) => {
        const da = a.last_activity || a.created_at || "";
        const db = b.last_activity || b.created_at || "";
        return da.localeCompare(db);
      });
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [contractsList, currentTab, searchQuery, sortBy]);

  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = ["Title", "Status", "Created At", "Last Activity", "Description"];
    const rows = filteredData.map((c) => [
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.status || ""}"`,
      `"${c.created_at || ""}"`,
      `"${c.last_activity || ""}"`,
      `"${(c.description || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contracts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<OrgContract>[] = [
    {
      id: "title",
      header: "Contract Name",
      cell: (row) => (
        <Box sx={{ py: 0.5 }}>
          <Typography variant="body2" fontWeight={600} color="#0f172a">
            {row.title}
          </Typography>
          {row.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.2 }}
            >
              {row.description}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: 170,
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "created_at",
      header: "Created Date",
      width: 150,
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
      id: "last_activity",
      header: "Last Activity",
      width: 150,
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.last_activity
            ? new Date(row.last_activity).toLocaleDateString("en-US", {
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
            setSelectedContract(row);
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
          <Typography
            variant="h4"
            fontWeight={700}
            color="#0f172a"
            sx={{ letterSpacing: "-0.02em" }}
          >
            Contracts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Overview of contracts sent for electronic signature, status and archiving.
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

          {hasPrivilege(Privileges.CREATE_CONTRACTS) && (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => router.push("/app/contracts/new")}
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
              Prepare contract
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter and Controls Bar */}
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
          Tabs={["All", "Pending", "Signed", "Draft"]}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Searchbar
            placeholder="Search by contract name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 260 } }}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
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
            <MenuItem value="newest">Sort: Newest</MenuItem>
            <MenuItem value="oldest">Sort: Oldest</MenuItem>
            <MenuItem value="title">Sort: Title A-Z</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Table */}
      <Box>
        <AppTable<OrgContract>
          data={filteredData}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(row) => router.push(`/app/contracts/${row.id}`)}
        />
      </Box>

      {/* Contract Detail Modal */}
      <ContractDetailModal
        open={!!selectedContract}
        onClose={() => setSelectedContract(null)}
        contract={selectedContract}
      />
    </Box>
  );
}
