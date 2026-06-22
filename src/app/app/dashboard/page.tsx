"use client";

import { Box, Button, Chip, Typography } from "@mui/material";
import Headline from "@/components/Headline";
import { useUserContext } from "@/context/UserContext";
import { useAuthContext } from "@/context/AuthContext";
import FloatingContainer from "@/components/FloatingContainer/FloatingContainer";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  getOrganizationDashboard,
  joinOrganization,
} from "@/services/organizations";
import { useEffect, useState } from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import StatCard from "@/components/Dashboard/StatCard";
import EditNoteIcon from "@mui/icons-material/EditNote";

function DashboardPage() {
  const { organizations, refreshOrganizations } = useAuthContext();
  const { selectedOrgId, mode } = useUserContext();
  const { showSnackbar } = useSnackbar();
  const [stats, setStats] = useState<{
    new_clients: number;
    new_contracts: number;
  } | null>(null);

  const pendingInvites = organizations.filter(
    (o) => o.role_status === "INVITED",
  );

  useEffect(() => {
    if (!selectedOrgId || mode !== "organization") return;
    getOrganizationDashboard(selectedOrgId)
      .then((response) => {
        setStats(response.data);
      })
      .catch(() => {
        setStats(null);
      });
  }, [selectedOrgId, mode]);

  const displayStats = mode === "organization" ? stats : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Headline
        title="Dashboard"
        description="Monitor your client relationships and financial performance"
      />

      {mode === "organization" && stats && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <StatCard
            icon={<PeopleOutlineIcon />}
            label="New Clients"
            value={stats.new_clients}
          />
          <StatCard
            icon={<EditNoteIcon />}
            label="New Contracts"
            value={stats.new_contracts}
          />
        </Box>
      )}

      {pendingInvites.length > 0 && (
        <FloatingContainer>
          <Headline title="Pending Invitations" size="small" marginBottom={2} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {pendingInvites.map((org) => (
              <Box
                key={org.organization_id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {org.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Invited{" "}
                    {new Date(org.joined_at).toLocaleDateString("cs-CZ")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={async () => {
                      try {
                        await joinOrganization(org.organization_id);
                        showSnackbar(
                          "Joined organization successfully",
                          "success",
                        );
                        await refreshOrganizations();
                      } catch {
                        showSnackbar("Failed to join organization.", "error");
                      }
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled
                  >
                    Decline
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </FloatingContainer>
      )}
    </Box>
  );
}

export default DashboardPage;
