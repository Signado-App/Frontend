"use client";

import Headline from "@/components/Headline";
import { Box, Button, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../Dashboard/StatCard";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { OrgClientDetail } from "../../types/types";
import { useSnackbar } from "@/context/SnackbarContext";

type Props = {
  client?: OrgClientDetail;
};

export default function InvoicesTab({ client }: Props) {
  const { showSnackbar } = useSnackbar();

  const handleCreateInvoice = () => {
    showSnackbar(
      "Invoicing module will be available in the upcoming billing update.",
      "info",
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Invoices"
          description="Track payments and billing for this client"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateInvoice}
        >
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
          label="Total Invoices"
          value="0"
          icon={<ReceiptOutlinedIcon sx={{ color: "#3b82f6" }} />}
        />
        <StatCard
          label="Total Amount"
          value="$0.00"
          icon={<AttachMoneyOutlinedIcon sx={{ color: "#22c55e" }} />}
        />
        <StatCard
          label="Paid"
          value="$0.00"
          icon={<CheckCircleOutlineIcon sx={{ color: "#22c55e" }} />}
        />
        <StatCard
          label="Outstanding"
          value="$0.00"
          icon={<WarningAmberOutlinedIcon sx={{ color: "#ef4444" }} />}
        />
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 3,
          borderStyle: "dashed",
          borderColor: "#cbd5e1",
          bgcolor: "#f8fafc",
        }}
      >
        <ReceiptOutlinedIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }} />
        <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
          No invoices for this client yet
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
          maxWidth={420}
          mx="auto"
        >
          There are currently no issued or pending invoices recorded for{" "}
          {client?.client_name || "this client"}.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateInvoice}
        >
          Create New Invoice
        </Button>
      </Paper>
    </Box>
  );
}
