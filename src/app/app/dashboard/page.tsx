"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { useAuthContext } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  getOrganizationDashboard,
  joinOrganization,
} from "@/services/organizations";
import { getOrgContracts } from "@/services/orgContracts";
import { getContracts } from "@/services/contracts";
import { OrgContract } from "@/types/types";
import ContractDetailModal from "@/components/Contract/ContractDetailModal";
import StatCard from "@/components/Dashboard/StatCard";
import StatusChip from "@/components/StatusChip";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";

export default function DashboardPage() {
  const router = useRouter();
  const { user, organizations, refreshOrganizations } = useAuthContext();
  const { selectedOrgId, mode } = useUserContext();
  const { hasPrivilege } = usePrivileges();
  const { showSnackbar } = useSnackbar();

  const [stats, setStats] = useState<{
    new_clients: number;
    new_contracts: number;
  } | null>(null);
  const [contracts, setContracts] = useState<OrgContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<OrgContract | null>(null);

  const pendingInvites = (organizations || []).filter(
    (o) => o.role_status === "INVITED",
  );

  useEffect(() => {
    if (selectedOrgId && mode === "organization") {
      getOrganizationDashboard(selectedOrgId)
        .then((response) => setStats(response.data))
        .catch(() => setStats(null));

      getOrgContracts(selectedOrgId)
        .then((res) => {
          const list = Array.isArray(res?.contracts)
            ? res.contracts
            : Array.isArray(res?.data)
              ? res.data
              : [];
          setContracts(list);
        })
        .catch(() => setContracts([]));
    } else {
      getContracts()
        .then((res) => {
          const list = Array.isArray(res?.contracts)
            ? res.contracts
            : Array.isArray(res?.data)
              ? res.data
              : [];
          setContracts(list);
        })
        .catch(() => setContracts([]));
    }
  }, [selectedOrgId, mode]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#0f172a"
            sx={{ letterSpacing: "-0.02em" }}
          >
            Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Overview of your organization, recent contracts and activity.
          </Typography>
        </Box>

        {hasPrivilege(Privileges.CREATE_CONTRACTS) && (
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => router.push("/app/contracts/new")}
            sx={{
              borderRadius: "10px",
              bgcolor: "#5046e5",
              fontWeight: 600,
              textTransform: "none",
              px: 2.2,
              py: 0.9,
              boxShadow: "0 2px 4px rgba(80, 70, 229, 0.25)",
              "&:hover": { bgcolor: "#4338ca" },
            }}
          >
            Prepare Contract
          </Button>
        )}
      </Box>

      {/* Pending Organization Invitations */}
      {pendingInvites.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            bgcolor: "#fffbeb",
            borderRadius: "16px",
            border: "1px solid #fef3c7",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} color="#92400e" mb={1.5}>
            Pending Invitations
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {pendingInvites.map((org) => (
              <Box
                key={org.organization_id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #fde68a",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600} color="#0f172a">
                    {org.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Invited {new Date(org.joined_at).toLocaleDateString("en-US")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: "#5046e5", "&:hover": { bgcolor: "#4338ca" } }}
                    onClick={async () => {
                      try {
                        await joinOrganization(org.organization_id);
                        showSnackbar("Joined organization successfully", "success");
                        await refreshOrganizations();
                      } catch {
                        showSnackbar("Failed to join organization.", "error");
                      }
                    }}
                  >
                    Accept
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Real Stat Cards (Organization mode) */}
      {mode === "organization" && stats && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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

      {/* Recent Contracts Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 0.5,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#0f172a">
            Recent Contracts
          </Typography>
          <Box
            component={Link}
            href="/app/contracts"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.3,
              color: "#5046e5",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            View all contracts
            <ChevronRightRoundedIcon sx={{ fontSize: "1rem" }} />
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #f1ede7",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            overflow: "hidden",
          }}
        >
          {contracts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No contracts found yet.
              </Typography>
              {hasPrivilege(Privileges.CREATE_CONTRACTS) && (
                <Button
                  variant="contained"
                  onClick={() => router.push("/app/contracts/new")}
                  sx={{
                    mt: 2,
                    bgcolor: "#5046e5",
                    "&:hover": { bgcolor: "#4338ca" },
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Prepare Contract
                </Button>
              )}
            </Box>
          ) : (
            contracts.slice(0, 6).map((contract, index) => (
              <Box
                key={contract.id || index}
                onClick={() => setSelectedContract(contract)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  borderBottom:
                    index < Math.min(contracts.length, 6) - 1
                      ? "1px solid #f8fafc"
                      : "none",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: "#faf8f5",
                  },
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1, pr: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="#0f172a"
                    noWrap
                  >
                    {contract.title}
                  </Typography>
                  {contract.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.2 }}
                      noWrap
                    >
                      {contract.description}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <StatusChip status={contract.status} />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    {contract.last_activity
                      ? new Date(contract.last_activity).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </Typography>

                  <IconButton size="small" sx={{ color: "#94a3b8" }}>
                    <ChevronRightRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Contract Detail Modal */}
      <ContractDetailModal
        open={!!selectedContract}
        onClose={() => setSelectedContract(null)}
        contract={selectedContract}
      />
    </Box>
  );
}
