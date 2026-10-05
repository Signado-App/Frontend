"use client";

import { use, useEffect, useState, useCallback } from "react";
import { OrgClientDetail } from "@/types/types";
import { getOrgClient } from "@/services/orgClients";
import { useUserContext } from "@/context/UserContext";
import { Box, CircularProgress } from "@mui/material";
import BackButton from "@/components/Clients/BackButton";
import ClientPageContent from "@/components/Clients/ClientPageContent";
import ClientInfo from "@/components/Clients/ClientInfo";

export default function ClientPage({
  params,
}: {
  params: Promise<{ client_id: string }>;
}) {
  const { client_id } = use(params);
  const { selectedOrgId } = useUserContext();
  const [client, setClient] = useState<OrgClientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshClient = useCallback(() => {
    if (!selectedOrgId) return;
    getOrgClient(selectedOrgId, Number(client_id))
      .then((response) => {
        setClient(response.client);
      })
      .catch((err) => {
        console.error("Failed to load client details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedOrgId, client_id]);

  useEffect(() => {
    refreshClient();
  }, [refreshClient]);

  if (loading || !client) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <BackButton href="/app/clients" label="Back to Clients" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
        <Box>
          <ClientInfo client={client} onClientUpdated={refreshClient} />
        </Box>
        <Box>
          <ClientPageContent client={client} />
        </Box>
      </Box>
    </Box>
  );
}
