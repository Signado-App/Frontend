"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Invoice } from "@/components/types";

type Props = {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
};

const lineItems = [
  {
    description: "Software Development",
    quantity: 40,
    rate: "$150.00",
    amount: "$6,000.00",
  },
  {
    description: "Project Management",
    quantity: 20,
    rate: "$200.00",
    amount: "$4,000.00",
  },
  {
    description: "Testing & QA",
    quantity: 25,
    rate: "$120.00",
    amount: "$3,000.00",
  },
];

const statusColors = {
  Paid: { bg: "#dcfce7", text: "#22c55e" },
  Pending: { bg: "#fef3c7", text: "#f97316" },
  Overdue: { bg: "#fee2e2", text: "#ef4444" },
};

export default function InvoiceDetailModal({ open, onClose, invoice }: Props) {
  if (!invoice) return null;
  const style = statusColors[invoice.status];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Invoice Details - {invoice.id}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadOutlinedIcon />}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SendOutlinedIcon />}
              >
                Send Reminder
              </Button>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            mt: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Invoice Information
            </Typography>
            {[
              { label: "Invoice Number:", value: invoice.id },
              { label: "Issue Date:", value: invoice.issueDate },
              { label: "Due Date:", value: invoice.dueDate },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Status:
              </Typography>
              <Chip
                label={invoice.status}
                size="small"
                sx={{
                  bgcolor: style.bg,
                  color: style.text,
                  fontWeight: 600,
                  borderRadius: "20px",
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Client Information
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Client:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {invoice.client}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1.5}>
          Line Items
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {["Description", "Quantity", "Rate", "Amount"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {lineItems.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.rate}</TableCell>
                <TableCell>{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Box sx={{ bgcolor: "#f8fafc", borderRadius: 2, px: 3, py: 2 }}>
            <Typography variant="body1" fontWeight={700}>
              Total Amount:{" "}
              <span style={{ fontSize: "1.25rem" }}>{invoice.amount}</span>
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
