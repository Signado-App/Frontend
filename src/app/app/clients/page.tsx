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
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";
import { Client, OrgClient } from "@/types/types";
import { getClients } from "@/services/clients";
import { useUserContext } from "@/context/UserContext";
import { getOrgClients } from "@/services/orgClients";
import AddClientModal from "@/components/Organization/AddClientModal";

function ClientsPage() {
  const [currentTab, setCurrentTab] = useState("Active");
  const router = useRouter();
  const { selectedOrgId } = useUserContext();
  const [data, setData] = useState<OrgClient[]>([]);
  const [addClientOpen, setAddClientOpen] = useState(false);

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgClients(selectedOrgId)
      .then((response) => setData(response.clients))
      .catch(() => setData([]));
  }, [selectedOrgId]);

  const columns: ColumnDef<OrgClient>[] = [
    {
      id: "client_name",
      header: "Client Name",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.client_name}
        </Typography>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Active: { bg: "#e0f2fe", text: "#0ea5e9" },
          Signed: { bg: "#dcfce7", text: "#22c55e" },
          Expired: { bg: "#f3f4f6", text: "#64748b" },
          Draft: { bg: "#fef9c3", text: "#eab308" },
        };
        const style = colors[row.status] ?? { bg: "#f3f4f6", text: "#64748b" };

        return (
          <Chip
            label={row.status}
            size="small"
            sx={{
              bgcolor: style.bg,
              color: style.text,
              fontWeight: 600,
              borderRadius: "6px",
              height: "24px",
              fontSize: "0.75rem",
            }}
          />
        );
      },
    },
    {
      id: "created_at",
      header: "Created At",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString("cs-CZ")
            : "-"}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "left",
      cell: (row) => (
        <Button
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          variant="outlined"
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => {
            router.push(`/app/clients/${row.id}`);
          }}
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
          title="Clients"
          description="Manage your client relationships"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddClientOpen(true)}
        >
          Add New Client
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <StatusTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          Tabs={["Active", "Inactive"]}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Searchbar placeholder="Search by client name" sx={{ width: 320 }} />
          <Select value="main" size="small" sx={{}}>
            <MenuItem value="main">Name A-Z</MenuItem>
            <MenuItem value="second">Highest value</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box>
        <AppTable<OrgClient>
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
      <AddClientModal
        open={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        onSuccess={() => {
          if (selectedOrgId)
            getOrgClients(selectedOrgId)
              .then((r) => setData(r.clients))
              .catch(() => {});
        }}
      />
    </Box>
  );
}

export default ClientsPage;
