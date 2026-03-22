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
import { useEffect, useState } from "react";
import { Contract } from "@/types/types";
import ContractDetailModal from "@/components/Contract/ContractDetailModal";
import { getContracts } from "@/services/contracts";

function ContractsPage() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [currentTab, setCurrentTab] = useState("All");
  const [data, setData] = useState<Contract[]>([]);

  useEffect(() => {
    getContracts().then(setData);
  }, []);
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
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.primary",
          }}
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => setSelectedContract(row)}
        >
          View
        </Button>
      ),
    },
  ];
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
      <ContractDetailModal
        open={!!selectedContract}
        onClose={() => setSelectedContract(null)}
        contract={selectedContract}
      />
    </Box>
  );
}

export default ContractsPage;
