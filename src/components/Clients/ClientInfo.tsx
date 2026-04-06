import { Box, Typography, Paper } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import Headline from "../Headline";
import FloatingContainer from "../FloatingContainer/FloatingContainer";

type ClientInfoProps = {
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
};

const infoItems = [
  {
    icon: <LocationOnOutlinedIcon sx={{ color: "#60a5fa" }} />,
    iconBg: "#eff6ff",
    label: "Address",
    key: "address",
  },
  {
    icon: <PersonOutlineOutlinedIcon sx={{ color: "#4ade80" }} />,
    iconBg: "#f0fdf4",
    label: "Contact Person",
    key: "contactPerson",
  },
  {
    icon: <MailOutlineIcon sx={{ color: "#a78bfa" }} />,
    iconBg: "#f5f3ff",
    label: "Email",
    key: "email",
  },
  {
    icon: <LocalPhoneOutlinedIcon sx={{ color: "#f97316" }} />,
    iconBg: "#fff7ed",
    label: "Phone",
    key: "phone",
  },
];

export default function ClientInfo({
  name,
  address,
  contactPerson,
  email,
  phone,
}: ClientInfoProps) {
  const values = { address, contactPerson, email, phone };

  return (
    // <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
    <FloatingContainer>
      <Headline title={name} description="Client relationship overview" />
      <Box sx={{ display: "flex", gap: 4 }}>
        {infoItems.map(({ icon, iconBg, label, key }) => (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
          >
            <Box
              sx={{
                bgcolor: iconBg,
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                {label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {values[key as keyof typeof values]}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </FloatingContainer>
    // </Paper>
  );
}
