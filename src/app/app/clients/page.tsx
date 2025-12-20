"use client";

import { Box, Button } from "@mui/material";
import Headline from "@/components/Headline";
import AddIcon from "@mui/icons-material/Add";
import StatusTabs from "@/components/StatusTabs";
import { useState } from "react";
import Searchbar from "@/components/Searchbar/Searchbar";
import { Select, MenuItem } from "@mui/material";
import AppTable from "@/components/Table/AppTable";
import { ColumnDef } from "@/components/Table/AppTable";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

type Client = {
  id: string;
  name: string;
  status: "Active" | "Signed" | "Expired" | "Draft";
  contractsCount: number;
  totalValue: string;
};

const data: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    status: "Active",
    contractsCount: 5,
    totalValue: "$150,000",
  },
  {
    id: "2",
    name: "Globex Inc.",
    status: "Signed",
    contractsCount: 2,
    totalValue: "$50,000",
  },
  {
    id: "3",
    name: "Soylent Corp.",
    status: "Expired",
    contractsCount: 3,
    totalValue: "$75,000",
  },
  {
    id: "4",
    name: "Initech",
    status: "Draft",
    contractsCount: 1,
    totalValue: "$10,000",
  },
];

const columns: ColumnDef<Client>[] = [
  {
    id: "name",
    header: "Client Name",
    cell: (row) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {row.name}
      </Typography>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => {
      const colors = {
        Active: { bg: "#e0f2fe", text: "#0ea5e9" },
        Signed: { bg: "#dcfce7", text: "#22c55e" },
        Expired: { bg: "#f3f4f6", text: "#64748b" },
        Draft: { bg: "#fef9c3", text: "#eab308" },
      };
      const style = colors[row.status];

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
    id: "contractsCount",
    header: "Contracts Count",
    cell: (row) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {row.contractsCount}
      </Typography>
    ),
  },
  {
    id: "totalValue",
    header: "Total Value",
    cell: (row) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {row.totalValue}
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
          color: "text.primary",
        }}
        startIcon={<VisibilityOutlinedIcon />}
      >
        View
      </Button>
    ),
  },
];

function ClientsPage() {
  const [currentTab, setCurrentTab] = useState("Active");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Clients"
          description="Manage your client relationships"
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
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
        <AppTable<Client> data={data} columns={columns} />
      </Box>
    </Box>
  );
}

export default ClientsPage;
