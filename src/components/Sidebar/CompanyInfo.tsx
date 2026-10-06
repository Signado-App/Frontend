"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SignadoLogo from "./SignadoLogo";
import { useAuthContext } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";

interface CompanyInfoProps {
  isCollapsed?: boolean;
  onOpenCreateOrgModal?: () => void;
  onSelectOrg?: (orgId: number) => void;
}

export default function CompanyInfo({
  isCollapsed = false,
  onOpenCreateOrgModal,
  onSelectOrg,
}: CompanyInfoProps) {
  const { user, organizations } = useAuthContext();
  const { mode, selectedOrgId } = useUserContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const activeOrg = organizations?.find(
    (o) => o.organization_id === selectedOrgId,
  );

  const currentOrgName =
    mode === "organization" && activeOrg
      ? activeOrg.name
      : `${user?.first_name ?? "Personal"} (Client)`;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOrgClick = (orgId: number) => {
    handleClose();
    onSelectOrg?.(orgId);
  };

  return (
    <>
      <Box
        onClick={handleOpenMenu}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          p: 0.5,
          borderRadius: "10px",
          transition: "background-color 0.15s ease",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
          justifyContent: isCollapsed ? "center" : "flex-start",
          width: "100%",
        }}
      >
        <SignadoLogo size={isCollapsed ? 30 : 34} />

        {!isCollapsed && (
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                color: "#ffffff",
                lineHeight: 1.15,
                fontSize: "1.05rem",
                letterSpacing: "-0.01em",
              }}
            >
              Signado
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.25,
              }}
            >
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: "rgba(255, 255, 255, 0.72)",
                  fontSize: "0.78rem",
                  maxWidth: "140px",
                }}
              >
                {currentOrgName}
              </Typography>
              <KeyboardArrowDownRoundedIcon
                sx={{
                  fontSize: "0.95rem",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Organization Switcher Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isCollapsed ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              border: "1px solid #f1f5f9",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            SWITCH ORGANIZATION
          </Typography>
        </Box>

        <MenuItem
          selected={mode === "client" || selectedOrgId === 0}
          onClick={() => handleOrgClick(0)}
          sx={{ borderRadius: "8px", mx: 0.5, mb: 0.5 }}
        >
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
            secondary="Personal client account"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>

        {(organizations ?? [])
          .filter((org) => org.role_status !== "INVITED")
          .map((org) => (
            <MenuItem
              key={org.organization_id}
              selected={mode === "organization" && selectedOrgId === org.organization_id}
              onClick={() => handleOrgClick(org.organization_id)}
              sx={{ borderRadius: "8px", mx: 0.5, mb: 0.5 }}
            >
              <ListItemIcon>
                <BusinessRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={org.name}
                secondary="Organization"
                primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </MenuItem>
          ))}

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={() => {
            handleClose();
            onOpenCreateOrgModal?.();
          }}
          sx={{ borderRadius: "8px", mx: 0.5 }}
        >
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="New Organization"
            primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
