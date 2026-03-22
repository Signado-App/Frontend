import Headline from "@/components/Headline";
import { Box, Button, Chip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../StatCard";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AppTable, { ColumnDef } from "../Table/AppTable";
import { Invoice } from "../../types/types";

const columns: ColumnDef<Invoice>[] = [
  {
    id: "id",
    header: "Invoice ID",
    cell: (row) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {row.id}
      </Typography>
    ),
  },
  {
    id: "name",
    header: "Invoice Name",
    cell: (row) => (
      <Typography variant="body2" color="text.primary">
        {row.client}
      </Typography>
    ),
  },
  {
    id: "issueDate",
    header: "Issue Date",
    cell: (row) => (
      <Typography variant="body2" color="text.primary">
        {row.issueDate}
      </Typography>
    ),
  },
  {
    id: "dueDate",
    header: "Due Date",
    cell: (row) => (
      <Typography variant="body2" color="text.primary">
        {row.dueDate}
      </Typography>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    cell: (row) => (
      <Typography variant="body2" color="text.primary">
        {row.amount}
      </Typography>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => {
      const colors = {
        Paid: { bg: "#dcfce7", text: "#22c55e" },
        Pending: { bg: "#fef3c7", text: "#f97316" },
        Overdue: { bg: "#fee2e2", text: "#ef4444" },
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

const data: Invoice[] = [
  {
    id: "INV-2024-001",
    client: "TechCorp Solutions",
    issueDate: "Dec 1, 2024",
    dueDate: "Dec 31, 2024",
    amount: "$15,000.00",
    status: "Paid",
  },
  {
    id: "INV-2024-002",
    client: "Global Industries Ltd",
    issueDate: "Dec 5, 2024",
    dueDate: "Jan 5, 2025",
    amount: "$8,500.00",
    status: "Pending",
  },
  {
    id: "INV-2024-003",
    client: "StartUp Innovations",
    issueDate: "Nov 15, 2024",
    dueDate: "Dec 15, 2024",
    amount: "$3,200.00",
    status: "Overdue",
  },
  {
    id: "INV-2024-004",
    client: "Enterprise Networks",
    issueDate: "Dec 10, 2024",
    dueDate: "Dec 25, 2024",
    amount: "$12,000.00",
    status: "Pending",
  },
];

export default function InvoicesTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Invoices"
          description="Track payments and billing for this client"
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Create Invoice
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
          name="Total Invoices"
          value="4"
          icon={<ReceiptOutlinedIcon sx={{ color: "#3b82f6" }} />}
        />
        <StatCard
          name="Total Amount"
          value="$28.7K"
          icon={<AttachMoneyOutlinedIcon sx={{ color: "#22c55e" }} />}
        />
        <StatCard
          name="Paid"
          value="$23K"
          icon={<AttachMoneyOutlinedIcon sx={{ color: "#22c55e" }} />}
        />
        <StatCard
          name="Outstanding"
          value="$5.7K"
          icon={<WarningAmberOutlinedIcon sx={{ color: "#ef4444" }} />}
        />
      </Box>
      <Box>
        <AppTable<Invoice> data={data} columns={columns} />
      </Box>
    </Box>
  );
}
