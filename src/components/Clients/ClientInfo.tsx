"use client";

import { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import Headline from "../Headline";
import FloatingContainer from "../FloatingContainer/FloatingContainer";
import EditClientModal from "./EditClientModal";
import { OrgClientDetail } from "@/types/types";

type ClientInfoProps = {
  client: OrgClientDetail;
  onClientUpdated?: (updated?: any) => void;
};

export default function ClientInfo({
  client,
  onClientUpdated,
}: ClientInfoProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const name =
    client.client_name ||
    (client.client_metadata?.client_name as string) ||
    "Client Details";
  const address =
    (client.client_metadata?.address as string) || "Not specified";
  const firstName =
    (client.client_metadata?.first_name as string) ||
    client.user_details?.first_name ||
    "";
  const lastName =
    (client.client_metadata?.last_name as string) ||
    client.user_details?.last_name ||
    "";
  const contactPerson =
    (client.client_metadata?.contact_person as string) ||
    `${firstName} ${lastName}`.trim() ||
    "Not specified";
  const email =
    (client.client_metadata?.email as string) ||
    client.user_details?.email ||
    "Not specified";
  const phone =
    (client.client_metadata?.phone as string) ||
    (client.client_metadata?.phone_number as string) ||
    "Not specified";

  const infoItems = [
    {
      icon: <LocationOnOutlinedIcon sx={{ color: "#60a5fa" }} />,
      iconBg: "#eff6ff",
      label: "Address",
      value: address,
    },
    {
      icon: <PersonOutlineOutlinedIcon sx={{ color: "#4ade80" }} />,
      iconBg: "#f0fdf4",
      label: "Contact Person",
      value: contactPerson,
    },
    {
      icon: <MailOutlineIcon sx={{ color: "#a78bfa" }} />,
      iconBg: "#f5f3ff",
      label: "Email",
      value: email,
    },
    {
      icon: <LocalPhoneOutlinedIcon sx={{ color: "#f97316" }} />,
      iconBg: "#fff7ed",
      label: "Phone",
      value: phone,
    },
  ];

  const handleCreateContract = () => {
    router.push(
      `/app/contracts/new?clientId=${client.id}&clientUserId=${client.user_id}`,
    );
  };

  return (
    <FloatingContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Headline title={name} description="Client relationship overview" />

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setEditOpen(true)}
          >
            Edit Client
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateContract}
          >
            Create Contract
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {infoItems.map(({ icon, iconBg, label, value }) => (
          <Box
            key={label}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
          >
            <Box
              sx={{
                bgcolor: iconBg,
                borderRadius: "50%",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <EditClientModal
        open={editOpen}
        client={client}
        onClose={() => setEditOpen(false)}
        onSuccess={(updatedData) => {
          if (onClientUpdated) onClientUpdated(updatedData);
        }}
      />
    </FloatingContainer>
  );
}
