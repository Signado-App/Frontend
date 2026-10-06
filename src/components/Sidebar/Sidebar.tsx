"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import PagesList from "./PagesList";
import CompanyInfo from "./CompanyInfo";
import CreateOrganizationModal from "../Organization/CreateOrganizationModal";
import { useSnackbar } from "@/context/SnackbarContext";
import { useRouter } from "next/navigation";
import { usePrivileges } from "@/context/PrivilegesContext";
import { useUserContext } from "@/context/UserContext";
import { useAuthContext } from "@/context/AuthContext";
import { getOrganizationInfo } from "@/services/organizations";
import { Privilege } from "@/types/types";

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedOrgId");
      return stored ? Number(stored) : 0;
    }
    return 0;
  });

  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { loadPrivileges } = usePrivileges();
  const { mode, setMode } = useUserContext();
  const { organizations, refreshOrganizations } = useAuthContext();

  const validSelectedOrg = organizations.some(
    (o) => o.organization_id === selectedOrg,
  )
    ? selectedOrg
    : 0;

  const mergePrivileges = (data: any): Privilege[] => {
    const direct = (data.privileges ?? []).map(
      (p: any) => parseInt(p.id) as Privilege,
    );
    const fromGroups = (data.groups ?? []).flatMap((g: any) =>
      (g.privileges ?? []).map((p: any) => parseInt(p.id) as Privilege),
    );
    return [...new Set([...direct, ...fromGroups])];
  };

  useEffect(() => {
    if (validSelectedOrg === 0 && mode === "organization") {
      setMode("client", null, null);
    }
  }, [validSelectedOrg]);

  useEffect(() => {
    if (selectedOrg && selectedOrg !== 0 && organizations.length > 0) {
      getOrganizationInfo(selectedOrg)
        .then((response) => {
          const privileges = mergePrivileges(response.data);
          loadPrivileges(privileges);
          setMode("organization", selectedOrg, response.data);
        })
        .catch(() => {
          showSnackbar("Failed to load organization info.", "error");
        });
    }
  }, [organizations, selectedOrg]);

  const handleSelectOrg = (value: number) => {
    setSelectedOrg(value);
    setMode(
      value === 0 ? "client" : "organization",
      value === 0 ? null : value,
    );
    if (value && value !== 0) {
      getOrganizationInfo(value)
        .then((response) => {
          const privileges = mergePrivileges(response.data);
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
  };

  const width = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <Box
      component="aside"
      sx={{
        width,
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#5046e5",
        color: "#ffffff",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        px: isCollapsed ? 1.5 : 2,
        py: 2.5,
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s ease",
        boxShadow: "4px 0 20px rgba(0, 0, 0, 0.05)",
        overflowX: "hidden",
      }}
    >
      {/* Header: Logo and Organization */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          mb: 3,
        }}
      >
        <CompanyInfo
          isCollapsed={isCollapsed}
          onOpenCreateOrgModal={() => setModalOpen(true)}
          onSelectOrg={handleSelectOrg}
        />
      </Box>

      {/* Main Navigation List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <PagesList mode={mode} isCollapsed={isCollapsed} />
      </Box>

      {/* Lower Section: Storage meter and Collapse Toggle */}
      <Box
        sx={{
          mt: "auto",
          pt: 1.5,
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {/* Storage Meter */}
        <Box
          sx={{
            mt: 0.5,
            mb: 0.5,
            px: isCollapsed ? 0.5 : 1.5,
            py: 1,
            borderRadius: "10px",
            bgcolor: "rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 0.8,
            alignItems: isCollapsed ? "center" : "stretch",
          }}
        >
          {isCollapsed ? (
            <Tooltip title="Storage usage: 2.4 / 50 GB" placement="right" arrow>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CloudQueueRoundedIcon sx={{ fontSize: "1.25rem", color: "rgba(255, 255, 255, 0.85)" }} />
              </Box>
            </Tooltip>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <CloudQueueRoundedIcon
                    sx={{ fontSize: "1.1rem", color: "rgba(255, 255, 255, 0.8)" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.75)",
                      fontWeight: 500,
                    }}
                  >
                    Storage
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.95)",
                    fontWeight: 600,
                  }}
                >
                  2.4 / 50 GB
                </Typography>
              </Box>
              {/* Progress bar */}
              <Box
                sx={{
                  width: "100%",
                  height: "3px",
                  borderRadius: "2px",
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "5%",
                    height: "100%",
                    borderRadius: "2px",
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                  }}
                />
              </Box>
            </>
          )}
        </Box>

        {/* Toggle Collapse Button */}
        {onToggleCollapse && (
          <Box
            sx={{
              display: "flex",
              justifyContent: isCollapsed ? "center" : "flex-end",
              mt: 0.5,
            }}
          >
            <Tooltip
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              placement={isCollapsed ? "right" : "top"}
              arrow
            >
              <IconButton
                onClick={onToggleCollapse}
                size="small"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    color: "#ffffff",
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                {isCollapsed ? (
                  <ChevronRightRoundedIcon fontSize="small" />
                ) : (
                  <ChevronLeftRoundedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          showSnackbar("Organization created successfully", "success");
          setModalOpen(false);
          refreshOrganizations();
        }}
      />
    </Box>
  );
}
