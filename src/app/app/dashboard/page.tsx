"use client";

import { Box, Button, Chip, Typography } from "@mui/material";
import Headline from "@/components/Headline";
import { useUserContext } from "@/context/UserContext";
import { useAuthContext } from "@/context/AuthContext";
import FloatingContainer from "@/components/FloatingContainer/FloatingContainer";

function DashboardPage() {
  const { organizations } = useAuthContext();
  const pendingInvites = organizations.filter(
    (o) => o.role_status === "INVITED",
  );

  return (
    <Box>
      <Headline
        title="Dashboard"
        description="Monitor your client relationships and financial performance"
      />
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
                  <Button variant="contained" size="small" disabled>
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
