"use client";

import Headline from "@/components/Headline";
import { Box, Button, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../Dashboard/StatCard";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { OrgClientDetail } from "../../types/types";
import { useSnackbar } from "@/context/SnackbarContext";

type Props = {
  client?: OrgClientDetail;
};

export default function DocumentsTab({ client }: Props) {
  const { showSnackbar } = useSnackbar();

  const handleUpload = () => {
    showSnackbar(
      "Document storage will be available with the upcoming cloud storage integration.",
      "info",
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Documents"
          description="Store and manage client files and attachments"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleUpload}
        >
          Upload Document
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        <StatCard
          label="Total Files"
          value="0"
          icon={<FolderOpenOutlinedIcon sx={{ color: "#60a5fa" }} />}
        />
        <StatCard
          label="Contracts"
          value="0"
          icon={<DescriptionOutlinedIcon sx={{ color: "#4ade80" }} />}
        />
        <StatCard
          label="Attachments"
          value="0"
          icon={<AttachFileOutlinedIcon sx={{ color: "#a855f7" }} />}
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
        <FolderOpenOutlinedIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }} />
        <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
          No documents uploaded yet
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
          maxWidth={420}
          mx="auto"
        >
          No documents or files have been attached to {client?.client_name || "this client"}.
          Upload contracts, IDs, or supplemental agreements here.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleUpload}
        >
          Upload First Document
        </Button>
      </Paper>
    </Box>
  );
}
