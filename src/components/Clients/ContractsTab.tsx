import Headline from "@/components/Headline";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../Dashboard/StatCard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AppTable, { ColumnDef } from "../Table/AppTable";
import { Contract } from "../../types/types";
import StatusChip from "../StatusChip";

const columns: ColumnDef<Contract>[] = [
  {
    id: "id",
    header: "Contract ID",
    cell: (row) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {row.id}
      </Typography>
    ),
  },
  {
    id: "name",
    header: "Contract Name",
    cell: (row) => (
      <Box>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {row.description}
        </Typography>
      </Box>
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
      >
        View
      </Button>
    ),
  },
];

const data: Contract[] = [
  {
    id: "1",
    name: "Software Agreement",
    description: "Full-stack application development with React and Node.js",
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

export default function ContractsTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Contracts"
          description="Manage client contracts and agreements"
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add New Contract
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
        }}
      >
        <StatCard
          label="Total Contracts"
          value="4"
          icon={<DescriptionOutlinedIcon sx={{ color: "#60a5fa" }} />}
        />
        <StatCard
          label="Signed"
          value="2"
          icon={<DescriptionOutlinedIcon sx={{ color: "#4ade80" }} />}
        />
        <StatCard
          label="Pending"
          value="1"
          icon={<AccessTimeOutlinedIcon sx={{ color: "#f59e0b" }} />}
        />
        <StatCard
          label="Total Value"
          value="$80.5K"
          icon={<AttachMoneyOutlinedIcon sx={{ color: "#a78bfa" }} />}
        />
      </Box>
      <Box>
        <AppTable<Contract> data={data} columns={columns} />
      </Box>
    </Box>
  );
}
