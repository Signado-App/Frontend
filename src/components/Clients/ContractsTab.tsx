import Headline from "@/components/Headline";
import { Box, Button, Chip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../StatCard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AppTable, { ColumnDef } from "../Table/AppTable";
import { Contract } from "../types";

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
          name="Total Contracts"
          value="4"
          icon={<DescriptionOutlinedIcon sx={{ color: "#60a5fa" }} />}
        />
        <StatCard
          name="Signed"
          value="2"
          icon={<DescriptionOutlinedIcon sx={{ color: "#4ade80" }} />}
        />
        <StatCard
          name="Pending"
          value="1"
          icon={<AccessTimeOutlinedIcon sx={{ color: "#f59e0b" }} />}
        />
        <StatCard
          name="Total Value"
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
