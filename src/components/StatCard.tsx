import { Box, Typography } from "@mui/material";
import FloatingContainer from "./FloatingContainer/FloatingContainer";

type StatCardProps = {
  icon: React.ReactNode;
  name: string;
  value: string;
  iconBg?: string;
};

export default function StatCard({ icon, name, value, iconBg }: StatCardProps) {
  return (
    <FloatingContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {name}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: iconBg ?? "#f0f9ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
    </FloatingContainer>
  );
}
