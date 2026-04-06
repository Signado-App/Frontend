"use client";

import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import ContractsTab from "@/components/Clients/ContractsTab";
import InvoicesTab from "@/components/Clients/InvoicesTab";
import DocumentsTab from "@/components/Clients/DocumentsTab";

export default function ClientPageContent() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Box>
        <Tabs value={tab} onChange={(_, val) => setTab(val)}>
          <Tab
            iconPosition="start"
            icon={<ArticleOutlinedIcon fontSize="small" />}
            label="Contracts"
          />
          <Tab
            iconPosition="start"
            icon={<ReceiptOutlinedIcon fontSize="small" />}
            label="Invoices"
          />
          <Tab
            iconPosition="start"
            icon={<FolderOpenOutlinedIcon fontSize="small" />}
            label="Documents"
          />
        </Tabs>
      </Box>
      <Box sx={{ mt: 3 }}>
        {tab === 0 && <ContractsTab />}
        {tab === 1 && <InvoicesTab />}
        {tab === 2 && <DocumentsTab />}
      </Box>
    </Box>
  );
}
