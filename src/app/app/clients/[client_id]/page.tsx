import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClientInfo from "@/components/Clients/ClientInfo";
import ClientPageContent from "@/components/Clients/ClientPageContent";
import BackToClientsButton from "@/components/Clients/BackButton";

async function ClientPage({
  params,
}: {
  params: Promise<{ client_id: string }>;
}) {
  const { client_id } = await params;

  return (
    <Box>
      <BackToClientsButton />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
        <Box>
          <ClientInfo
            name="TechCorp Solutions"
            address="1234 Innovation Drive, Tech Valley, CA 94301"
            contactPerson="Sarah Johnson"
            email="sarah.johnson@techcorp.com"
            phone="+1 (555) 123-4567"
          />
        </Box>
        <Box>
          <ClientPageContent />
        </Box>
      </Box>
    </Box>
  );
}

export default ClientPage;
