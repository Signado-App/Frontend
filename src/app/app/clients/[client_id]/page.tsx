"use client";

import { use, useEffect, useState } from "react";
import { OrgClientDetail } from "@/types/types";
import { getOrgClient } from "@/services/orgClients";
import { useUserContext } from "@/context/UserContext";
import { Box } from "@mui/material";
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

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgClient(selectedOrgId, Number(client_id)).then((response) => {
      setClient(response.data);
    });
  }, [selectedOrgId, client_id]);

  if (!client) return null;
  return (
    <Box>
      <BackButton href="/app/clients" label="Back to Clients" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
        <Box>
          <ClientInfo
            name={client.client_name}
            address={(client.client_metadata?.address as string) ?? ""}
            contactPerson={`${client.user_details.first_name ?? ""} ${client.user_details.last_name ?? ""}`}
            email={client.user_details.email ?? ""}
            phone={(client.client_metadata?.phone as string) ?? ""}
          />
        </Box>
        <Box>
          <ClientPageContent />
        </Box>
      </Box>
    </Box>
  );
}
