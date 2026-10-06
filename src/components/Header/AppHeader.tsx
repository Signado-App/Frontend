"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  InputBase,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";
import { useSnackbar } from "@/context/SnackbarContext";
import CreateOrganizationModal from "../Organization/CreateOrganizationModal";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, organizations, refreshOrganizations } = useAuthContext();
  const { mode, selectedOrgId, setMode } = useUserContext();
  const { showSnackbar } = useSnackbar();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const placeholder = pathname.includes("/clients")
    ? "Search client, contact or email..."
    : pathname.includes("/contracts")
      ? "Search contracts or recipients..."
      : "Search contracts or recipients...";

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
      {/* Search pill */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#ffffff",
          borderRadius: "9999px",
          px: 2,
          py: 0.6,
          width: { xs: "220px", sm: "340px", md: "420px" },
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          "&:focus-within": {
            borderColor: "#5046e5",
            boxShadow: "0 0 0 3px rgba(80, 70, 229, 0.1)",
          },
        }}
      >
        <SearchIcon sx={{ color: "#94a3b8", fontSize: "1.25rem", mr: 1 }} />
        <InputBase
          inputRef={searchInputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          sx={{
            flex: 1,
            fontSize: "0.875rem",
            color: "#1e293b",
            "& input::placeholder": {
              color: "#94a3b8",
              opacity: 1,
            },
          }}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            width: 22,
            height: 22,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#94a3b8",
            userSelect: "none",
          }}
        >
          /
        </Box>
      </Box>

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

        {/* Chat icon */}
        <IconButton
          size="medium"
          sx={{
            color: "#334155",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <ChatBubbleOutlineRoundedIcon sx={{ fontSize: "1.3rem" }} />
        </IconButton>

        {/* Notification bell with badge "3" */}
        <IconButton
          onClick={() => router.push("/app/notifications")}
          size="medium"
          sx={{
            color: "#334155",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <Badge
            badgeContent={3}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "#5046e5",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                borderRadius: "8px",
                padding: "0 4px",
              },
            }}
          >
            <NotificationsNoneRoundedIcon sx={{ fontSize: "1.35rem" }} />
          </Badge>
        </IconButton>

        {/* Calendar icon */}
        <IconButton
          size="medium"
          sx={{
            color: "#334155",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <CalendarTodayOutlinedIcon sx={{ fontSize: "1.2rem" }} />
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

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "14px",
                minWidth: 230,
                mt: 1,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                border: "1px solid #f1f5f9",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />

          {/* Org switch options in user menu */}
          <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              ACCOUNT MODE
            </Typography>
          </Box>
          <MenuItem
            selected={mode === "client"}
            onClick={() => {
              setUserMenuAnchor(null);
              setMode("client", null, null);
              router.push("/app/dashboard");
            }}
            sx={{ mx: 0.5, borderRadius: "8px" }}
          >
            <ListItemText
              primary="Client profile"
              primaryTypographyProps={{ variant: "body2" }}
            />
            {mode === "client" && <CheckRoundedIcon fontSize="small" sx={{ color: "#5046e5" }} />}
          </MenuItem>

          {(organizations ?? [])
            .filter((org) => org.role_status !== "INVITED")
            .map((org) => (
              <MenuItem
                key={org.organization_id}
                selected={mode === "organization" && selectedOrgId === org.organization_id}
                onClick={() => {
                  setUserMenuAnchor(null);
                  setMode("organization", org.organization_id);
                  router.push("/app/dashboard");
                }}
                sx={{ mx: 0.5, borderRadius: "8px" }}
              >
                <ListItemText
                  primary={org.name}
                  primaryTypographyProps={{ variant: "body2" }}
                />
                {mode === "organization" && selectedOrgId === org.organization_id && (
                  <CheckRoundedIcon fontSize="small" sx={{ color: "#5046e5" }} />
                )}
              </MenuItem>
            ))}

          <Divider sx={{ my: 1 }} />
          <MenuItem
            onClick={() => {
              setUserMenuAnchor(null);
              router.push("/app/settings");
            }}
            sx={{ mx: 0.5, borderRadius: "8px" }}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ variant: "body2" }} />
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ mx: 0.5, borderRadius: "8px", color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText primary="Log out" primaryTypographyProps={{ variant: "body2" }} />
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
