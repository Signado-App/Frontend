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
import { Contract, OrgContract } from "@/types/types";
import ContractDetailModal from "@/components/Contract/ContractDetailModal";
import { getContracts } from "@/services/contracts";
import { useUserContext } from "@/context/UserContext";
import { getOrgContracts } from "@/services/orgContracts";

function ContractsPage() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [currentTab, setCurrentTab] = useState("All");
  const { selectedOrgId } = useUserContext();
  const [data, setData] = useState<OrgContract[]>([]);

  useEffect(() => {
    if (selectedOrgId) {
      getOrgContracts(selectedOrgId).then((response) => {
        setData(response.data);
      });
    } else {
      getContracts().then((response) => {
        setData(response.data);
      });
    }
  }, [selectedOrgId]);

  const columns: ColumnDef<OrgContract>[] = [
    {
      id: "title",
      header: "Contract Name",
      cell: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.title}
        </Typography>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const colors: Record<string, { bg: string; text: string }> = {
          active: { bg: "#e0f2fe", text: "#0ea5e9" },
          signed: { bg: "#dcfce7", text: "#22c55e" },
          expired: { bg: "#f3f4f6", text: "#64748b" },
          draft: { bg: "#fef9c3", text: "#eab308" },
        };
        const style = colors[row.status.toLowerCase()] ?? {
          bg: "#f3f4f6",
          text: "#64748b",
        };
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
      id: "last_activity",
      header: "Last Activity",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.last_activity
            ? new Date(row.last_activity).toLocaleDateString("cs-CZ")
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
        <AppTable<OrgContract> data={data} columns={columns} />
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
