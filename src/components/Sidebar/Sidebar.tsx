"use client";

import React, { useEffect, useState } from "react";
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
import CreateOrganizationModal from "../Organization/CreateOrganizationModal";
import { useSnackbar } from "@/context/SnackbarContext";
import { useRouter } from "next/navigation";
import { usePrivileges } from "@/context/PrivilegesContext";
import { useUserContext } from "@/context/UserContext";
import { useAuthContext } from "@/context/AuthContext";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { getOrganizationInfo } from "@/services/organizations";
import { Privilege } from "@/types/types";
import { Privileges } from "@/constants/privileges";

const SIDEBAR_WIDTH = 280;

export default function Sidebar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<number>(0);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { hasPrivilege, loadPrivileges } = usePrivileges();
  const { mode, setMode } = useUserContext();
  const { refresh, logout, user, organizations, refreshOrganizations } =
    useAuthContext();
  const validSelectedOrg = organizations.some(
    (o) => o.organization_id === selectedOrg,
  )
    ? selectedOrg
    : 0;

  useEffect(() => {
    const stored = localStorage.getItem("selectedOrgId");
    if (stored) setSelectedOrg(Number(stored));
  }, []);

  useEffect(() => {
    if (selectedOrg && selectedOrg !== 0 && organizations.length > 0) {
      getOrganizationInfo(selectedOrg)
        .then((response) => {
          const privileges = response.data.privileges.map(
            (p: any) => parseInt(p.id) as Privilege,
          );
          loadPrivileges(privileges);
          setMode("organization", selectedOrg, response.data);
        })
        .catch(() => {
          showSnackbar("Failed to load organization info.", "error");
        });
    }
  }, [organizations, selectedOrg]);
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
        value={validSelectedOrg ?? 0}
        size="small"
        onChange={(e) => {
          const value = e.target.value as number;
          setSelectedOrg(value);
          setMode(
            value === 0 ? "client" : "organization",
            value === 0 ? null : value,
          );
          if (value && value !== 0) {
            getOrganizationInfo(value)
              .then((response) => {
                const privileges = response.data.privileges.map(
                  (p: any) => parseInt(p.id) as Privilege,
                );
                loadPrivileges(privileges);
                setMode("organization", value, response.data);
              })
              .catch(() => {
                showSnackbar("Failed to load organization info.", "error");
              });
          } else {
            loadPrivileges([]);
            setMode("client", null, null);
          }
          router.push("/app/dashboard");
        }}
      >
        <MenuItem value={0}>
          {user?.first_name ?? ""} {user?.last_name ?? ""} (Client)
        </MenuItem>
        {(organizations ?? [])
          .filter((org) => org.role_status !== "INVITED")
          .map((org) => (
            <MenuItem key={org.organization_id} value={org.organization_id}>
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
      {hasPrivilege(Privileges.CREATE_CONTRACTS) && (
        <Button
          variant="contained"
          fullWidth
          sx={{ py: 1.5 }}
          startIcon={<AddIcon />}
          onClick={() => router.push("/app/contracts/new")}
        >
          Create Contract
        </Button>
      )}
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
        <PagesList mode={mode} />
      </Box>
      <CreateOrganizationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          showSnackbar("Organization created successfully", "success");
          setModalOpen(false);
          refreshOrganizations();
        }}
      />
      <Button variant="text" fullWidth onClick={refresh} sx={{ mt: "auto" }}>
        Test get user
      </Button>
      <Button
        variant="text"
        fullWidth
        startIcon={<LogoutOutlinedIcon />}
        onClick={logout}
        sx={{ mt: "auto" }}
      >
        Logout
      </Button>
    </Box>
  );
}
