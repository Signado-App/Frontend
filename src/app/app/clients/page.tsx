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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";
import { Client, OrgClient } from "@/types/types";
import { getClients } from "@/services/clients";
import { useUserContext } from "@/context/UserContext";
import { getOrgClients } from "@/services/orgClients";
import AddClientModal from "@/components/Organization/AddClientModal";
import { Privileges } from "@/constants/privileges";
import { usePrivileges } from "@/context/PrivilegesContext";
import StatusChip from "@/components/StatusChip";

function ClientsPage() {
  const [currentTab, setCurrentTab] = useState("Active");
  const router = useRouter();
  const { selectedOrgId } = useUserContext();
  const [data, setData] = useState<OrgClient[]>([]);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const { hasPrivilege } = usePrivileges();
  const statusMap: Record<string, string> = {
    All: "",
    Active: "ACTIVE",
    Disabled: "DISABLED",
  };

  const filteredData =
    currentTab === "All"
      ? data
      : data.filter((c) => c.status === statusMap[currentTab]);

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
        return <StatusChip status={row.status} />;
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
        {hasPrivilege(Privileges.CREATE_CLIENTS) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddClientOpen(true)}
          >
            Add New Client
          </Button>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <StatusTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          Tabs={["All", "Active", "Disabled"]}
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
          data={filteredData}
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
