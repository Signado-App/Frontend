"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";
import { useSnackbar } from "@/context/SnackbarContext";
import { getOrganizationInfo, mergePrivileges } from "@/services/organizations";
import CreateOrganizationModal from "../Organization/CreateOrganizationModal";

export default function AppHeader() {
  const router = useRouter();
  const { user, logout, organizations, refreshOrganizations } =
    useAuthContext();
  const { mode, selectedOrgId, setMode } = useUserContext();
  const { hasPrivilege, loadPrivileges } = usePrivileges();
  const { showSnackbar } = useSnackbar();

  const isOrg = mode === "organization";
  const canCreateContract = isOrg && hasPrivilege(Privileges.CREATE_CONTRACTS);
  const canSeeClients =
    isOrg &&
    (hasPrivilege(Privileges.CREATE_CLIENTS) ||
      hasPrivilege(Privileges.SEE_ALL_CLIENTS));
  const canSeeUsers =
    isOrg &&
    (hasPrivilege(Privileges.ADD_USERS) ||
      hasPrivilege(Privileges.USERS_ACCESSIBLE));

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleSwitchToClient = () => {
    setUserMenuAnchor(null);
    loadPrivileges([]);
    setMode("client", null, null);
    showSnackbar("Switched to Personal client account", "success");
    router.push("/app/dashboard");
  };

  const handleSwitchToOrg = async (orgId: number) => {
    setUserMenuAnchor(null);
    setMode("organization", orgId);
    try {
      const response = await getOrganizationInfo(orgId);
      const privileges = mergePrivileges(response.data);
      loadPrivileges(privileges);
      setMode("organization", orgId, response.data);
      showSnackbar(
        `Switched to ${response.data?.organization_name || "organization"}`,
        "success",
      );
    } catch {
      showSnackbar("Failed to load organization info.", "error");
    } finally {
      router.push("/app/dashboard");
    }
  };

  const handleLogout = async () => {
    setUserMenuAnchor(null);
    try {
      await logout();
      showSnackbar("Successfully logged out", "success");
    } catch {
      showSnackbar("Signed out locally", "warning");
    } finally {
      router.push("/auth/login");
    }
  };

  const userInitial = user?.first_name?.[0]?.toUpperCase() || "S";

  return (
    <Box
      component="header"
      sx={{
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 4 },
        py: 1.5,
        bgcolor: "#faf8f5",
        gap: 2,
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Left spacer / header */}
      <Box sx={{ flex: 1 }} />

      {/* Right Actions */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}
      >
        {/* + New ⌄ button */}
        <Button
          onClick={(e) => setNewMenuAnchor(e.currentTarget)}
          startIcon={<AddRoundedIcon sx={{ fontSize: "1.15rem" }} />}
          endIcon={
            Boolean(newMenuAnchor) ? (
              <KeyboardArrowUpRoundedIcon
                sx={{ fontSize: "1.15rem", ml: -0.5 }}
              />
            ) : (
              <KeyboardArrowDownRoundedIcon
                sx={{ fontSize: "1.15rem", ml: -0.5 }}
              />
            )
          }
          sx={{
            bgcolor: "#f5f3ff",
            color: "#4f46e5",
            border: "1px solid rgba(99, 102, 241, 0.15)",
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            px: 2,
            py: 0.8,
            boxShadow: "0 1px 2px rgba(99, 102, 241, 0.05)",
            "&:hover": {
              bgcolor: "#ede9fe",
              borderColor: "rgba(99, 102, 241, 0.25)",
            },
          }}
        >
          New
        </Button>

        {/* Quick create menu matching screenshot */}
        <Menu
          anchorEl={newMenuAnchor}
          open={Boolean(newMenuAnchor)}
          onClose={() => setNewMenuAnchor(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "20px",
                width: isOrg ? 370 : 320,
                maxWidth: "calc(100vw - 32px)",
                mt: 1.25,
                p: 0.75,
                boxShadow:
                  "0 20px 45px -12px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                border: "1px solid #f1f5f9",
              },
            },
          }}
        >
          {/* Section: CONTRACTS */}
          {canCreateContract && (
            <Typography
              sx={{
                px: 2,
                pt: 0.75,
                pb: 0.75,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#94a3b8",
                textTransform: "uppercase",
              }}
            >
              Contracts
            </Typography>
          )}

          {canCreateContract && (
            <MenuItem
              onClick={() => {
                setNewMenuAnchor(null);
                router.push("/app/contracts/new");
              }}
              sx={{
                py: 1.25,
                px: 1.5,
                mx: 0.5,
                my: 0.25,
                borderRadius: "14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.75,
                whiteSpace: "normal",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "#f8fafc",
                  "& .menu-icon-box": {
                    bgcolor: "#ede9fe",
                    color: "#4f46e5",
                    borderColor: "#ddd6fe",
                  },
                },
              }}
            >
              <Box
                className="menu-icon-box"
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: "12px",
                  bgcolor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                  mt: 0.25,
                  transition: "all 0.15s ease",
                }}
              >
                <DriveFileRenameOutlineRoundedIcon sx={{ fontSize: "1.25rem" }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#0f172a",
                    fontSize: "0.9rem",
                    lineHeight: 1.25,
                    mb: 0.35,
                  }}
                >
                  New Contract
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.78rem",
                    lineHeight: 1.35,
                  }}
                >
                  Document for digital signature
                </Typography>
              </Box>
            </MenuItem>
          )}

          {canCreateContract && (
            <Divider sx={{ my: 1, borderColor: "#f1f5f9" }} />
          )}

          {/* Section: PEOPLE & ORGANIZATIONS / ORGANIZATION */}
          <Typography
            sx={{
              px: 2,
              pt: 0.75,
              pb: 0.75,
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            {isOrg ? "People & Organizations" : "Organization"}
          </Typography>

          {canSeeClients && (
            <MenuItem
              onClick={() => {
                setNewMenuAnchor(null);
                router.push("/app/clients");
              }}
              sx={{
                py: 1.25,
                px: 1.5,
                mx: 0.5,
                my: 0.25,
                borderRadius: "14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.75,
                whiteSpace: "normal",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "#f8fafc",
                  "& .menu-icon-box": {
                    bgcolor: "#ede9fe",
                    color: "#4f46e5",
                    borderColor: "#ddd6fe",
                  },
                },
              }}
            >
              <Box
                className="menu-icon-box"
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: "12px",
                  bgcolor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                  mt: 0.25,
                  transition: "all 0.15s ease",
                }}
              >
                <PersonAddOutlinedIcon sx={{ fontSize: "1.25rem" }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#0f172a",
                    fontSize: "0.9rem",
                    lineHeight: 1.25,
                    mb: 0.35,
                  }}
                >
                  New Client
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.78rem",
                    lineHeight: 1.35,
                  }}
                >
                  Person or company you send requests to
                </Typography>
              </Box>
            </MenuItem>
          )}

          {canSeeUsers && (
            <MenuItem
              onClick={() => {
                setNewMenuAnchor(null);
                router.push("/app/users");
              }}
              sx={{
                py: 1.25,
                px: 1.5,
                mx: 0.5,
                my: 0.25,
                borderRadius: "14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.75,
                whiteSpace: "normal",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "#f8fafc",
                  "& .menu-icon-box": {
                    bgcolor: "#ede9fe",
                    color: "#4f46e5",
                    borderColor: "#ddd6fe",
                  },
                },
              }}
            >
              <Box
                className="menu-icon-box"
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: "12px",
                  bgcolor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                  mt: 0.25,
                  transition: "all 0.15s ease",
                }}
              >
                <GroupsOutlinedIcon sx={{ fontSize: "1.25rem" }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#0f172a",
                    fontSize: "0.9rem",
                    lineHeight: 1.25,
                    mb: 0.35,
                  }}
                >
                  New Team Member
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.78rem",
                    lineHeight: 1.35,
                  }}
                >
                  Invite colleague to organization
                </Typography>
              </Box>
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              setNewMenuAnchor(null);
              setCreateModalOpen(true);
            }}
            sx={{
              py: 1.25,
              px: 1.5,
              mx: 0.5,
              my: 0.25,
              borderRadius: "14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.75,
              whiteSpace: "normal",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "#f8fafc",
                "& .menu-icon-box": {
                  bgcolor: "#ede9fe",
                  color: "#4f46e5",
                  borderColor: "#ddd6fe",
                },
              },
            }}
          >
            <Box
              className="menu-icon-box"
              sx={{
                width: 40,
                height: 40,
                minWidth: 40,
                borderRadius: "12px",
                bgcolor: "#f1f5f9",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569",
                mt: 0.25,
                transition: "all 0.15s ease",
              }}
            >
              <BusinessOutlinedIcon sx={{ fontSize: "1.25rem" }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#0f172a",
                  fontSize: "0.9rem",
                  lineHeight: 1.25,
                  mb: 0.35,
                }}
              >
                New Organization
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "0.78rem",
                  lineHeight: 1.35,
                }}
              >
                Create a new company workspace
              </Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* Notifications button */}
        <IconButton
          onClick={() => router.push("/app/notifications")}
          size="medium"
          sx={{
            color: "#334155",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <NotificationsNoneRoundedIcon sx={{ fontSize: "1.35rem" }} />
        </IconButton>

        {/* User avatar with dropdown */}
        <Box
          onClick={(e) => setUserMenuAnchor(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            p: 0.5,
            borderRadius: "9999px",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "#1e293b",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            {userInitial}
          </Avatar>
          <KeyboardArrowDownRoundedIcon
            sx={{ fontSize: "1rem", color: "#64748b" }}
          />
        </Box>

        {/* User Menu matching screenshot */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "16px",
                width: 300,
                minWidth: 280,
                maxWidth: "calc(100vw - 32px)",
                mt: 1.5,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                border: "1px solid #f1f5f9",
                overflow: "hidden",
                p: 0,
              },
            },
          }}
        >
          {/* User profile header card */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2 }}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: "#e0e7ff",
                color: "#4338ca",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              {userInitial}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={700}
                color="#0f172a"
                noWrap
              >
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography
                variant="caption"
                color="#64748b"
                noWrap
                sx={{ display: "block" }}
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Divider />

          {/* My Account */}
          <MenuItem
            onClick={() => {
              setUserMenuAnchor(null);
              router.push("/app/settings");
            }}
            sx={{ px: 2, py: 1.2 }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#64748b" }}>
              <PersonOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="My account"
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
            />
          </MenuItem>

          <Divider />

          {/* Workspaces & Accounts Section */}
          <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={700}
              sx={{
                fontSize: "0.72rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Workspaces & Accounts
            </Typography>
          </Box>

          {/* Personal Client Account */}
          <MenuItem
            selected={mode === "client" || !selectedOrgId}
            onClick={handleSwitchToClient}
            sx={{ px: 2, py: 1 }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: mode === "client" ? "#ede9fe" : "#f1f5f9",
                color: mode === "client" ? "#4f46e5" : "#334155",
                fontWeight: 700,
                fontSize: "0.75rem",
                mr: 1.5,
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: "1.05rem" }} />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="#0f172a"
                noWrap
              >
                {user?.first_name ?? "Personal"} {user?.last_name ?? "Account"}
              </Typography>
              <Typography
                variant="caption"
                color="#64748b"
                noWrap
                sx={{ display: "block" }}
              >
                Personal client account
              </Typography>
            </Box>
            {(mode === "client" || !selectedOrgId) && (
              <CheckRoundedIcon
                fontSize="small"
                sx={{ color: "#5046e5", ml: 1 }}
              />
            )}
          </MenuItem>

          {/* Organizations List */}
          {(organizations ?? [])
            .filter((org) => org.role_status !== "INVITED")
            .map((org) => {
              const orgInitials =
                org.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase())
                  .join("") || "CO";
              const isSelected =
                mode === "organization" &&
                selectedOrgId === org.organization_id;

              return (
                <MenuItem
                  key={org.organization_id}
                  selected={isSelected}
                  onClick={() => handleSwitchToOrg(org.organization_id)}
                  sx={{ px: 2, py: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: isSelected ? "#ede9fe" : "#f1f5f9",
                      color: isSelected ? "#4f46e5" : "#334155",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      mr: 1.5,
                    }}
                  >
                    {orgInitials}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="#0f172a"
                      noWrap
                    >
                      {org.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#64748b"
                      noWrap
                      sx={{ display: "block" }}
                    >
                      {org.role_status || "Member · Business"}
                    </Typography>
                  </Box>
                  {isSelected && (
                    <CheckRoundedIcon
                      fontSize="small"
                      sx={{ color: "#5046e5", ml: 1 }}
                    />
                  )}
                </MenuItem>
              );
            })}

          {/* New Organization Option */}
          <MenuItem
            onClick={() => {
              setUserMenuAnchor(null);
              setCreateModalOpen(true);
            }}
            sx={{ px: 2, py: 1 }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px dashed #cbd5e1",
                bgcolor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                mr: 1.5,
              }}
            >
              <AddRoundedIcon sx={{ fontSize: "1rem" }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="#475569"
                noWrap
              >
                New Organization
              </Typography>
            </Box>
          </MenuItem>

          <Divider />

          {/* Logout */}
          <MenuItem
            onClick={handleLogout}
            sx={{ px: 2, py: 1.2, color: "#ef4444" }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#ef4444" }}>
              <LogoutOutlinedIcon fontSize="small" sx={{ color: "#ef4444" }} />
            </ListItemIcon>
            <ListItemText
              primary="Log out"
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: 500,
                color: "#ef4444",
              }}
            />
          </MenuItem>
        </Menu>
      </Box>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          showSnackbar("Organization created successfully", "success");
          setCreateModalOpen(false);
          refreshOrganizations();
        }}
      />
    </Box>
  );
}
