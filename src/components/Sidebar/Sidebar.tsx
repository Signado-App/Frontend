"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PagesList from "./PagesList";
import CompanyInfo from "./CompanyInfo";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import CreateOrganizationModal from "../Organization/CreateOrganizationModal";
import { useSnackbar } from "@/context/SnackbarContext";
import { useRouter } from "next/navigation";

const SIDEBAR_WIDTH = 280;

export default function Sidebar() {
  const [view, setView] = useState<"main" | "second">("main");
  const [modalOpen, setModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState([
    { id: 1, name: "SupplierPro Solutions" },
  ]);
  const [selectedOrg, setSelectedOrg] = useState(0);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e5e7eb",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        p: 3,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        gap: 2,
        bgcolor: "background.paper",
      }}
    >
      <CompanyInfo />

      <Select
        value={selectedOrg}
        size="small"
        onChange={(e) => {
          const value = e.target.value as number;
          setSelectedOrg(value);
          setView(value === 0 ? "main" : "second");
        }}
      >
        <MenuItem value={0}>Client Account</MenuItem>
        {organizations.map((org) => (
          <MenuItem key={org.id} value={org.id}>
            {org.name}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
        }}
        startIcon={<BusinessOutlinedIcon />}
        onClick={() => setModalOpen(true)}
      >
        New Organization
      </Button>

      <Divider />

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
        }}
        startIcon={<AddIcon />}
        onClick={() => router.push("/app/contracts/new")}
      >
        Create Contract
      </Button>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: "bold",
          letterSpacing: 1,
          // px: 1,
          textTransform: "uppercase",
        }}
      >
        Navigation
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <PagesList view={view} />
      </Box>
      <CreateOrganizationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(org) => {
          console.log("Organization created:", org);
          showSnackbar("Organization created successfully", "success");
          setOrganizations((prev) => [...prev, { id: org.id, name: org.name }]);
          setSelectedOrg(org.id);
          setModalOpen(false);
        }}
      />
    </Box>
  );
}
