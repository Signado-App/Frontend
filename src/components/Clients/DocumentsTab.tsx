import Headline from "@/components/Headline";
import { Box, Button, Chip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../StatCard";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";

export default function DocumentsTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Documents"
          description="Store and manage client files and attachments"
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Upload Document
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
          name="Total Files"
          value="4"
          icon={<FolderOpenOutlinedIcon sx={{ color: "#60a5fa" }} />}
        />
        <StatCard
          name="Contracts"
          value="2"
          icon={<DescriptionOutlinedIcon sx={{ color: "#4ade80" }} />}
        />
        <StatCard
          name="Technical"
          value="1"
          icon={<DescriptionOutlinedIcon sx={{ color: "#a855f7" }} />}
        />
        <StatCard
          name="Financial"
          value="$80.5K"
          icon={<ReceiptOutlinedIcon sx={{ color: "#f97316" }} />}
        />
      </Box>
    </Box>
  );
}
