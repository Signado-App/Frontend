"use client";

import { Box, Button, Chip, Typography } from "@mui/material";
import Headline from "@/components/Headline";
import AppTable, { ColumnDef } from "@/components/Table/AppTable";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { Invoice } from "@/components/types";
import { useState } from "react";
import InvoiceDetailModal from "@/components/Invoice/InvoiceDetailModal";

function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

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
          onClick={() => setSelectedInvoice(row)}
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
  return (
    <Box>
      <Headline title="Invoices" />
      <Box>
        <AppTable<Invoice> data={data} columns={columns} />
      </Box>
      <InvoiceDetailModal
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </Box>
  );
}

export default InvoicesPage;
