"use client";

import { use, useEffect, useState, useCallback } from "react";
import { OrgClientDetail } from "@/types/types";
import { getOrgClient } from "@/services/orgClients";
import { useUserContext } from "@/context/UserContext";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { useRouter } from "next/navigation";
import StatusChip from "@/components/StatusChip";
import EditClientModal from "@/components/Clients/EditClientModal";
import ContractsTab from "@/components/Clients/ContractsTab";

export default function ClientPage({
  params,
}: {
  params: Promise<{ client_id: string }>;
}) {
  const { client_id } = use(params);
  const router = useRouter();
  const { selectedOrgId } = useUserContext();
  const [client, setClient] = useState<OrgClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const refreshClient = useCallback(
    (updatedFallback?: any) => {
      if (updatedFallback) {
        setClient((prev) => ({
          ...(prev || ({} as OrgClientDetail)),
          ...updatedFallback,
          client_metadata: {
            ...(prev?.client_metadata || {}),
            ...(updatedFallback.client_metadata || {}),
          },
        }));
      }

      if (!selectedOrgId) return;
      getOrgClient(selectedOrgId, Number(client_id))
        .then((response) => {
          const resolved = response?.client ?? response?.data ?? response;
          if (resolved && typeof resolved === "object") {
            setClient((prev) => ({
              ...(prev || ({} as OrgClientDetail)),
              ...resolved,
              ...(updatedFallback
                ? {
                    client_name:
                      updatedFallback.client_name || resolved.client_name,
                    client_metadata: {
                      ...(resolved.client_metadata || {}),
                      ...(updatedFallback.client_metadata || {}),
                    },
                  }
                : {}),
            }));
          }
        })
        .catch((err) => {
          console.error("Failed to load client details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [selectedOrgId, client_id],
  );

  useEffect(() => {
    refreshClient();
  }, [refreshClient]);

  if (loading || !client) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 350 }}>
        <CircularProgress />
      </Box>
    );
  }

  const name =
    client.client_name ||
    (client.client_metadata?.client_name as string) ||
    "Client Details";
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
    "-";
  const email =
    (client.client_metadata?.email as string) ||
    client.user_details?.email ||
    "-";
  const phone =
    (client.client_metadata?.phone as string) ||
    (client.client_metadata?.phone_number as string) ||
    "-";
  const address =
    (client.client_metadata?.address as string) || "-";
  const ico =
    (client.client_metadata?.ico as string) ||
    (client.client_metadata?.company_id as string) ||
    "-";
  const dic =
    (client.client_metadata?.dic as string) ||
    (client.client_metadata?.tax_id as string) ||
    "-";

  const handleCreateContract = () => {
    router.push(
      `/app/contracts/new?clientId=${client.id}&clientUserId=${client.user_id}`,
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", pb: 6 }}>
      {/* Top Back button */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => router.push("/app/clients")}
          sx={{
            textTransform: "none",
            color: "#64748b",
            fontWeight: 600,
            fontSize: "0.875rem",
            p: 0,
            "&:hover": { bgcolor: "transparent", color: "#0f172a" },
          }}
        >
          Clients
        </Button>
      </Box>

      {/* Header bar matching screenshot */}
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
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
              {name}
            </Typography>
            <StatusChip status={client.status || "ACTIVE"} />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              mt: 0.75,
              color: "#64748b",
              fontSize: "0.875rem",
            }}
          >
            <span>Company</span>
            {contactPerson !== "-" && <span>• {contactPerson}</span>}
            {email !== "-" && <span>• {email}</span>}
            {phone !== "-" && <span>• {phone}</span>}
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setEditOpen(true)}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              color: "#1e293b",
              borderColor: "#e2e8f0",
              bgcolor: "#ffffff",
              px: 2,
              py: 0.8,
              "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
            }}
          >
            Edit details
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleCreateContract}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#5046e5",
              px: 2.2,
              py: 0.8,
              boxShadow: "0 2px 4px rgba(80, 70, 229, 0.25)",
              "&:hover": { bgcolor: "#4338ca" },
            }}
          >
            New contract
          </Button>
        </Box>
      </Box>

      {/* Main 2-Column Grid matching screenshot */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left Column: Contracts list (real backend data only) */}
        <Box>
          <ContractsTab client={client} />
        </Box>

        {/* Right Column: Client Details Card matching screenshot */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
            bgcolor: "#ffffff",
            p: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <BusinessOutlinedIcon sx={{ color: "#64748b", fontSize: "1.2rem" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Details
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                IČO
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.25 }}>
                {ico}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                DIČ
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.25 }}>
                {dic}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "#f1f5f9" }} />

            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                Email
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.25 }}>
                {email}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                Phone
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.25 }}>
                {phone}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                Address
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.25 }}>
                {address}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                Contact Person
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.25 }}>
                {contactPerson}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Edit Client Modal */}
      <EditClientModal
        open={editOpen}
        client={client}
        onClose={() => setEditOpen(false)}
        onSuccess={(updatedData) => {
          refreshClient(updatedData);
        }}
      />
    </Box>
  );
}
