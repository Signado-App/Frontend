"use client";

import AppTable from "@/components/Table/AppTable";

import { Box } from "@mui/material";
import { ColumnDef } from "@/components/Table/AppTable";
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
import StatusChip from "@/components/StatusChip";

function ContractsPage() {
  const [selectedContract, setSelectedContract] = useState<OrgContract | null>(
    null,
  );
  const [currentTab, setCurrentTab] = useState("All");
  const { selectedOrgId } = useUserContext();
  const [data, setData] = useState<OrgContract[]>([]);
  const filteredData =
    currentTab === "All"
      ? data
      : data.filter((c) => c.status.toLowerCase() === currentTab.toLowerCase());

  useEffect(() => {
    if (selectedOrgId) {
      getOrgContracts(selectedOrgId)
        .then((response) => setData(response.contracts))
        .catch(() => setData([]));
    } else {
      getContracts()
        .then((response) => setData(response.contracts))
        .catch(() => setData([]));
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
        return <StatusChip status={row.status} />;
      },
    },
    {
      id: "last_activity",
      header: "Last Activity",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.last_activity
            ? new Date(row.last_activity).toLocaleString("cs-CZ")
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
        <AppTable<OrgContract> data={filteredData} columns={columns} />
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
