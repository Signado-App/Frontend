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
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";
import { useSnackbar } from "@/context/SnackbarContext";
import CreateOrganizationModal from "../Organization/CreateOrganizationModal";

export default function AppHeader() {
  const router = useRouter();
  const { user, logout, organizations, refreshOrganizations } = useAuthContext();
  const { mode, selectedOrgId, setMode } = useUserContext();
  const { showSnackbar } = useSnackbar();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

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
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
        {/* + New ⌄ button */}
        <Button
          onClick={(e) => setNewMenuAnchor(e.currentTarget)}
          startIcon={<AddRoundedIcon sx={{ fontSize: "1.1rem" }} />}
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: "1.1rem", ml: -0.5 }} />}
          sx={{
            bgcolor: "#ffffff",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            borderRadius: "9999px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            px: 2,
            py: 0.75,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            "&:hover": {
              bgcolor: "#f8fafc",
              borderColor: "#cbd5e1",
            },
          }}
        >
          New
        </Button>

        {/* Quick create menu */}
        <Menu
          anchorEl={newMenuAnchor}
          open={Boolean(newMenuAnchor)}
          onClose={() => setNewMenuAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "14px",
                minWidth: 190,
                mt: 1,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                border: "1px solid #f1f5f9",
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setNewMenuAnchor(null);
              router.push("/app/contracts/new");
            }}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              <EditNoteRoundedIcon fontSize="small" sx={{ color: "#5046e5" }} />
            </ListItemIcon>
            <ListItemText
              primary="New Contract"
              primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setNewMenuAnchor(null);
              router.push("/app/clients");
            }}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              <PersonAddOutlinedIcon fontSize="small" sx={{ color: "#0284c7" }} />
            </ListItemIcon>
            <ListItemText
              primary="New Client"
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
            />
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setNewMenuAnchor(null);
              setCreateModalOpen(true);
            }}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              <BusinessOutlinedIcon fontSize="small" sx={{ color: "#64748b" }} />
            </ListItemIcon>
            <ListItemText
              primary="New Organization"
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
            />
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
                minWidth: 260,
                mt: 1.5,
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
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
              <Typography variant="body2" fontWeight={700} color="#0f172a" noWrap>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="caption" color="#64748b" noWrap sx={{ display: "block" }}>
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

          {/* Companies Section */}
          <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Companies
            </Typography>
          </Box>

          {(organizations ?? [])
            .filter((org) => org.role_status !== "INVITED")
            .map((org) => {
              const orgInitials = org.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("") || "CO";
              const isSelected = mode === "organization" && selectedOrgId === org.organization_id;

              return (
                <MenuItem
                  key={org.organization_id}
                  selected={isSelected}
                  onClick={() => {
                    setUserMenuAnchor(null);
                    setMode("organization", org.organization_id);
                    router.push("/app/dashboard");
                  }}
                  sx={{ px: 2, py: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: "#f1f5f9",
                      color: "#334155",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      mr: 1.5,
                    }}
                  >
                    {orgInitials}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} color="#0f172a" noWrap>
                      {org.name}
                    </Typography>
                    <Typography variant="caption" color="#64748b" noWrap sx={{ display: "block" }}>
                      {org.role_status || "Member · Business"}
                    </Typography>
                  </Box>
                  {isSelected && (
                    <CheckRoundedIcon fontSize="small" sx={{ color: "#5046e5", ml: 1 }} />
                  )}
                </MenuItem>
              );
            })}

          {/* Add company */}
          <MenuItem
            onClick={() => {
              setUserMenuAnchor(null);
              setCreateModalOpen(true);
            }}
            sx={{ px: 2, py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#64748b" }}>
              <StorefrontOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Add company"
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
            />
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
              primaryTypographyProps={{ variant: "body2", fontWeight: 500, color: "#ef4444" }}
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
