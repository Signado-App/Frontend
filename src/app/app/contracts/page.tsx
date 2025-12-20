"use client";

import AppTable from "@/components/Table/AppTable";

import { Box } from "@mui/material";
import { ColumnDef } from "@/components/Table/AppTable";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Button from "@mui/material/Button";
import Headline from "@/components/Headline";
import Searchbar from "@/components/Searchbar/Searchbar";
import StatusTabs from "@/components/StatusTabs";
import { useState } from "react";

type Contract = {
  id: string;
  name: string;
  status: "Active" | "Signed" | "Expired" | "Draft";
  lastActivity: string;
};

const data: Contract[] = [
  {
    id: "1",
    name: "Software Agreement",
    status: "Active",
    lastActivity: "Dec 20, 2024",
  },
  {
    id: "2",
    name: "Consulting Contract",
    status: "Signed",
    lastActivity: "Dec 15, 2024",
  },
  {
    id: "3",
    name: "NDA Agreement",
    status: "Expired",
    lastActivity: "Nov 30, 2024",
  },
  {
    id: "4",
    name: "Service Level Agreement",
    status: "Draft",
    lastActivity: "Dec 18, 2024",
  },
];

const columns: ColumnDef<Contract>[] = [
  {
    id: "name",
    header: "Contract Name",
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
    id: "lastActivity",
    header: "Last Activity",
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
function ContractsPage() {
  const [currentTab, setCurrentTab] = useState("All");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Headline title="Contracts" />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <StatusTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          Tabs={["All", "Active", "Signed", "Expired", "Draft"]}
        />
      </Box>

      <Searchbar
        placeholder="Search by contract name or client"
        sx={{ width: 320 }}
      />
      <Box>
        <AppTable<Contract> data={data} columns={columns} />
      </Box>
    </Box>
  );
}

export default ContractsPage;
