import Headline from "@/components/Headline";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../StatCard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

export default function ContractsTab() {
  return (
    <Box>
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
          mt: 3,
        }}
      >
        <StatCard
          name="Total Contracts"
          value="4"
          icon={<DescriptionOutlinedIcon sx={{ color: "#60a5fa" }} />}
          iconBg="#eff6ff"
        />
        <StatCard
          name="Signed"
          value="2"
          icon={<DescriptionOutlinedIcon sx={{ color: "#4ade80" }} />}
          iconBg="#f0fdf4"
        />
        <StatCard
          name="Pending"
          value="1"
          icon={<AccessTimeOutlinedIcon sx={{ color: "#f59e0b" }} />}
          iconBg="#fffbeb"
        />
        <StatCard
          name="Total Value"
          value="$80.5K"
          icon={<AttachMoneyOutlinedIcon sx={{ color: "#a78bfa" }} />}
          iconBg="#f5f3ff"
        />
      </Box>
    </Box>
  );
}
