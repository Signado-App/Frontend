"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Contract, OrgContract } from "@/types/types";

const activityHistory = [];

type Props = {
  open: boolean;
  onClose: () => void;
  contract: OrgContract | null;
};

export default function ContractDetailModal({
  open,
  onClose,
  contract,
}: Props) {
  if (!contract) return null;
  const colors: Record<string, { bg: string; text: string }> = {
    active: { bg: "#e0f2fe", text: "#0ea5e9" },
    signed: { bg: "#dcfce7", text: "#22c55e" },
    expired: { bg: "#f3f4f6", text: "#64748b" },
    draft: { bg: "#fef9c3", text: "#eab308" },
  };
  const style = colors[contract.status.toLowerCase()] ?? {
    bg: "#f3f4f6",
    text: "#64748b",
  };

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
              Contract Details - {contract.id}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadOutlinedIcon />}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditOutlinedIcon />}
              >
                Add Amendment
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReceiptOutlinedIcon />}
              >
                Create Invoice
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
              Contract Information
            </Typography>
            {[
              { label: "Contract Name:", value: contract.title },
              { label: "Contract Number:", value: contract.id },
              { label: "Description:", value: contract.description ?? "-" },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 140 }}
                >
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 140 }}
              >
                Status:
              </Typography>
              <Chip
                label={contract.status}
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
              Dates & Value
            </Typography>
            {[
              {
                label: "Created:",
                value: contract.created_at
                  ? new Date(contract.created_at).toLocaleString("cs-CZ")
                  : "-",
              },
              {
                label: "Expires:",
                value: contract.expires_at
                  ? new Date(contract.expires_at).toLocaleString("cs-CZ")
                  : "-",
              },
              {
                label: "Last Activity:",
                value: contract.last_activity
                  ? new Date(contract.last_activity).toLocaleString("cs-CZ")
                  : "-",
              },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 120 }}
                >
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1.5}>
          Attached Files
        </Typography>
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {[].map((file, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                bgcolor: "white",
                borderBottom: i === 0 ? "1px solid #e5e7eb" : "none",
              }}
            >
              <DescriptionOutlinedIcon
                sx={{ color: "#64748b", fontSize: 20 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">{file.split(" • ")[0]}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {file.split(" • ").slice(1).join(" • ")}
                </Typography>
              </Box>
              <IconButton size="small">
                <DownloadOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1.5}>
          Activity History
        </Typography>
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {activityHistory.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderBottom:
                  i < activityHistory.length - 1 ? "1px solid #e5e7eb" : "none",
              }}
            >
              <CalendarTodayOutlinedIcon
                sx={{ color: "#94a3b8", fontSize: 20 }}
              />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.date} • {item.author}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
