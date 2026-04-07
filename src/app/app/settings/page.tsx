"use client";

import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import Headline from "@/components/Headline";
import { useState } from "react";
import { useProfileForm } from "@/hooks/useProfileForm";
import { usePasswordForm } from "@/hooks/usePasswordForm";
import FloatingContainer from "@/components/FloatingContainer/FloatingContainer";
import { useUserContext } from "@/context/UserContext";
import { useOrgForm } from "@/hooks/useOrgForm";

export default function SettingsPage() {
  const {
    form: profileForm,
    loading: profileLoading,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
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

  const { mode } = useUserContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Headline title="Settings" description="Manage your account settings." />

      {mode === "organization" && (
        <Box
          sx={{
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <FloatingContainer>
            <Headline title="Organization" size="small" marginBottom={2} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id="orgName"
                name="orgName"
                label="Organization Name"
                value={orgForm.name}
                onChange={handleOrgChange}
              />
              <Button
                variant="contained"
                sx={{ alignSelf: "flex-start" }}
                onClick={handleOrgSubmit}
              >
                Save Changes
              </Button>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Delete Organization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This action cannot be undone
                  </Typography>
                </Box>
                <Button variant="outlined" color="error">
                  Delete Organization
                </Button>
              </Box>
            </Box>
          </FloatingContainer>
        </Box>
      )}
      {mode === "client" && (
        <Box
          sx={{
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <FloatingContainer>
            <Headline title="Profile" size="small" marginBottom={2} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id="email"
                name="email"
                label="Email"
                value="signado@signado.com"
                disabled
                helperText="Contact support to change your email"
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={profileForm.firstName}
                  onChange={handleProfileChange}
                  sx={{ flex: 1 }}
                />
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  sx={{ flex: 1 }}
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
                sx={{ alignSelf: "flex-start" }}
                onClick={handleProfileSubmit}
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </FloatingContainer>

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
                error={
                  passwordForm.newPassword.length > 0 && !isNewPasswordValid
                }
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
                error={
                  passwordForm.confirmPassword.length > 0 && !passwordsMatch
                }
                helperText={
                  passwordForm.confirmPassword.length > 0 && !passwordsMatch
                    ? "Passwords don't match"
                    : ""
                }
              />
              <Button
                variant="contained"
                sx={{ alignSelf: "flex-start" }}
                onClick={handlePasswordSubmit}
                disabled={passwordLoading}
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </Box>
          </FloatingContainer>
          <FloatingContainer>
            <Headline
              title="Two Factor Authentication"
              size="small"
              marginBottom={2}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Two Factor Authentication
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add an extra layer of security to your account
                </Typography>
              </Box>
              <Button variant="outlined">Enable 2FA</Button>
            </Box>
          </FloatingContainer>
          <FloatingContainer>
            <Headline title="Delete Account" size="small" marginBottom={2} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Delete Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your account will be deleted. Your email will remain on
                  contracts you have signed.
                </Typography>
              </Box>
              <Button variant="outlined" color="error">
                Delete Account
              </Button>
            </Box>
          </FloatingContainer>
        </Box>
      )}
    </Box>
  );
}
