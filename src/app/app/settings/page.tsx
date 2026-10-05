"use client";

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Headline from "@/components/Headline";
import { useState } from "react";
import { useProfileForm } from "@/hooks/useProfileForm";
import { usePasswordForm } from "@/hooks/usePasswordForm";
import FloatingContainer from "@/components/FloatingContainer/FloatingContainer";
import { useUserContext } from "@/context/UserContext";
import { useOrgForm } from "@/hooks/useOrgForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuthContext } from "@/context/AuthContext";
import { deleteUser } from "@/services/user";
import { useSnackbar } from "@/context/SnackbarContext";
import { deleteOrganization } from "@/services/organizations";

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  const {
    form: profileForm,
    loading: profileLoading,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
    email,
  } = useProfileForm();

  const {
    form: passwordForm,
    loading: passwordLoading,
    handleChange: handlePasswordChange,
    handleSubmit: handlePasswordSubmit,
    isNewPasswordValid,
    passwordsMatch,
  } = usePasswordForm();

  const {
    form: orgForm,
    loading: orgLoading,
    handleChange: handleOrgChange,
    handleSubmit: handleOrgSubmit,
  } = useOrgForm();

  const { mode, selectedOrgId, setMode } = useUserContext();
  const { refreshOrganizations, logout } = useAuthContext();
  const { showSnackbar } = useSnackbar();

  const [deleteOrgOpen, setDeleteOrgOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Headline
        title="Settings"
        description="Manage your personal profile, organization settings, and account security."
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            iconPosition="start"
            icon={<PersonOutlineOutlinedIcon fontSize="small" />}
            label="Profile"
          />
          {mode === "organization" && (
            <Tab
              iconPosition="start"
              icon={<BusinessOutlinedIcon fontSize="small" />}
              label="Organization"
            />
          )}
          <Tab
            iconPosition="start"
            icon={<SecurityOutlinedIcon fontSize="small" />}
            label="Security & Account"
          />
        </Tabs>
      </Box>

      {/* Tab 0: Profile */}
      {tab === 0 && (
        <Box sx={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 3 }}>
          <FloatingContainer>
            <Headline title="Personal Information" size="small" marginBottom={2} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                id="email"
                name="email"
                label="Email"
                value={email}
                disabled
                helperText="Primary email used for account authentication"
              />
              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={profileForm.firstName}
                  onChange={handleProfileChange}
                  fullWidth
                />
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  fullWidth
                />
              </Box>
              <TextField
                id="phone"
                name="phone"
                label="Phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
              />
              <Button
                variant="contained"
                sx={{ alignSelf: "flex-start", mt: 1 }}
                onClick={handleProfileSubmit}
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save Profile Changes"}
              </Button>
            </Box>
          </FloatingContainer>
        </Box>
      )}

      {/* Tab 1: Organization (if in organization mode) */}
      {mode === "organization" && tab === 1 && (
        <Box sx={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 3 }}>
          <FloatingContainer>
            <Headline title="Organization Settings" size="small" marginBottom={2} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                id="orgName"
                name="name"
                label="Organization Name"
                value={orgForm.name}
                onChange={handleOrgChange}
                fullWidth
              />
              <Button
                variant="contained"
                sx={{ alignSelf: "flex-start" }}
                onClick={handleOrgSubmit}
                disabled={orgLoading}
              >
                {orgLoading ? "Saving..." : "Save Organization"}
              </Button>

              <Divider sx={{ my: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600} color="error.main">
                    Delete Organization
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Permanently delete this organization and revoke member access.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteOrgOpen(true)}
                >
                  Delete Organization
                </Button>
              </Box>

              <ConfirmDialog
                open={deleteOrgOpen}
                title="Delete Organization"
                description="This organization will be permanently deleted. This action cannot be undone."
                confirmLabel="Delete Organization"
                onConfirm={async () => {
                  try {
                    await deleteOrganization(selectedOrgId!);
                    showSnackbar("Organization deleted successfully", "success");
                    setMode("client", null, null);
                    await refreshOrganizations();
                  } catch {
                    showSnackbar("Failed to delete organization.", "error");
                  } finally {
                    setDeleteOrgOpen(false);
                  }
                }}
                onClose={() => setDeleteOrgOpen(false)}
              />
            </Box>
          </FloatingContainer>
        </Box>
      )}

      {/* Tab: Security & Account (index 2 for organization mode, index 1 for client mode) */}
      {((mode === "organization" && tab === 2) || (mode === "client" && tab === 1)) && (
        <Box sx={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 3 }}>
          <FloatingContainer>
            <Headline title="Change Password" size="small" marginBottom={2} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                error={passwordForm.newPassword.length > 0 && !isNewPasswordValid}
                helperText={
                  passwordForm.newPassword.length > 0 && !isNewPasswordValid
                    ? "Password must be at least 8 characters"
                    : ""
                }
              />
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                error={passwordForm.confirmPassword.length > 0 && !passwordsMatch}
                helperText={
                  passwordForm.confirmPassword.length > 0 && !passwordsMatch
                    ? "Passwords do not match"
                    : ""
                }
              />
              <Button
                variant="contained"
                sx={{ alignSelf: "flex-start" }}
                onClick={handlePasswordSubmit}
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </Box>
          </FloatingContainer>

          <FloatingContainer>
            <Headline title="Two-Factor Authentication" size="small" marginBottom={2} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Two-Factor Authentication (2FA)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Add an extra layer of security to prevent unauthorized access.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() =>
                  showSnackbar(
                    "Two-factor authentication will be available in the upcoming security release.",
                    "info",
                  )
                }
              >
                Enable 2FA
              </Button>
            </Box>
          </FloatingContainer>

          <FloatingContainer>
            <Headline title="Delete Account" size="small" marginBottom={2} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600} color="error.main">
                  Delete Account
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Permanently delete your account. This action cannot be reversed.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteOpen(true)}
              >
                Delete Account
              </Button>

              <ConfirmDialog
                open={deleteOpen}
                title="Delete Account"
                description="Your account will be permanently deleted. Your email will remain on contracts you have signed. This action cannot be undone."
                confirmLabel="Delete Account"
                onConfirm={async () => {
                  try {
                    await deleteUser();
                    logout();
                  } catch {
                    showSnackbar("Failed to delete account.", "error");
                  } finally {
                    setDeleteOpen(false);
                  }
                }}
                onClose={() => setDeleteOpen(false)}
              />
            </Box>
          </FloatingContainer>
        </Box>
      )}
    </Box>
  );
}
