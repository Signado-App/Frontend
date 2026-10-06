"use client";

import { useEffect, useState } from "react";
import Headline from "@/components/Headline";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StatCard from "../Dashboard/StatCard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AppTable, { ColumnDef } from "../Table/AppTable";
import { OrgClientDetail, OrgContract } from "../../types/types";
import StatusChip from "../StatusChip";
import { useUserContext } from "@/context/UserContext";
import { getOrgContracts, getOrgContract } from "@/services/orgContracts";
import { useRouter } from "next/navigation";
import ContractDetailModal from "@/components/Contract/ContractDetailModal";

type Props = {
  client?: OrgClientDetail;
};

export default function ContractsTab({ client }: Props) {
  const router = useRouter();
  const { selectedOrgId } = useUserContext();
  const [contracts, setContracts] = useState<OrgContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<OrgContract | null>(
    null,
  );

  useEffect(() => {
    if (!selectedOrgId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getOrgContracts(selectedOrgId)
      .then(async (response) => {
        const allContracts: OrgContract[] =
          response?.contracts || response?.data || [];
        if (!client) {
          setContracts(allContracts);
          return;
        }

        const clientUserId = client.user_id;
        const clientEmail = client.user_details?.email?.trim().toLowerCase();

        // If client has no user_id and no email, they cannot have contracts yet
        if (!clientUserId && !clientEmail) {
          setContracts([]);
          return;
        }

        // Fetch details for contracts to check actual parties
        const detailedContracts = await Promise.all(
          allContracts.map((c) =>
            getOrgContract(selectedOrgId, c.id)
              .then((res) => res.contract || c)
              .catch(() => c),
          ),
        );

        const clientContracts = detailedContracts.filter((c: any) => {
          if (!c) return false;
          // Direct client association check
          if (c.client_id && c.client_id === client.id) return true;
          if (
            c.client_user_id &&
            clientUserId &&
            c.client_user_id === clientUserId
          )
            return true;

          // Check if client is in parties
          if (Array.isArray(c.parties)) {
            return c.parties.some((p: any) => {
              if (clientUserId && p.user_id === clientUserId) return true;
              if (
                clientEmail &&
                p.email &&
                p.email.toLowerCase() === clientEmail
              )
                return true;
              return false;
            });
          }
          return false;
        });

        setContracts(clientContracts);
      })
      .catch((err) => {
        console.error("Failed to load client contracts:", err);
        setContracts([]);
      })
      .finally(() => setLoading(false));
  }, [selectedOrgId, client]);

  const handleAddContract = () => {
    if (client) {
      router.push(
        `/app/contracts/new?clientId=${client.id}&clientUserId=${client.user_id}`,
      );
    } else {
      router.push("/app/contracts/new");
    }
  };

  const columns: ColumnDef<OrgContract>[] = [
    {
      id: "title",
      header: "Contract Name",
      cell: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {row.title}
          </Typography>
          {row.description && (
            <Typography variant="body2" color="text.secondary">
              {row.description}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "last_activity",
      header: "Last Activity",
      cell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.last_activity
            ? new Date(row.last_activity).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "left",
      cell: (row) => (
        <Button
          variant="outlined"
          size="small"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.primary",
          }}
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => router.push(`/app/contracts/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const totalContracts = contracts.length;
  const signedContracts = contracts.filter((c) => c.status === "SIGNED").length;
  const pendingContracts = contracts.filter(
    (c) => c.status === "PENDING_SIGNATURES",
  ).length;
  const draftContracts = contracts.filter((c) => c.status === "DRAFT").length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Headline
          title="Contracts"
          description="Manage client contracts and agreements"
        />
      </Box>

      {/* Dynamic Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
        }}
      >
        <StatCard
          label="Total Contracts"
          value={String(totalContracts)}
          icon={<DescriptionOutlinedIcon sx={{ color: "#60a5fa" }} />}
        />
        <StatCard
          label="Signed"
          value={String(signedContracts)}
          icon={<CheckCircleOutlineIcon sx={{ color: "#4ade80" }} />}
        />
        <StatCard
          label="Pending"
          value={String(pendingContracts)}
          icon={<AccessTimeOutlinedIcon sx={{ color: "#f59e0b" }} />}
        />
        <StatCard
          label="Draft"
          value={String(draftContracts)}
          icon={<EditNoteIcon sx={{ color: "#a78bfa" }} />}
        />
      </Box>

      {/* Content Area */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
          <CircularProgress size={32} />
        </Box>
      ) : contracts.length === 0 ? (
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
          <DescriptionOutlinedIcon
            sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }}
          />
          <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
            No contracts for this client yet
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            maxWidth={420}
            mx="auto"
          >
            This client does not have any active or past contracts associated
            with their profile. Click below to create and assign the first
            contract.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddContract}
          >
            Create First Contract
          </Button>
        </Paper>
      ) : (
        <Box>
          <AppTable<OrgContract>
            data={contracts}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={(row) => router.push(`/app/contracts/${row.id}`)}
          />
        </Box>
      )}

      <ContractDetailModal
        open={!!selectedContract}
        onClose={() => setSelectedContract(null)}
        contract={selectedContract}
      />
    </Box>
  );
}
