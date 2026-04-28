"use client";

import { use } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import Headline from "@/components/Headline";
import { useResetPasswordForm } from "@/hooks/useResetPasswordForm";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const {
    form,
    loading,
    error,
    handleChange,
    handleSubmit,
    isPasswordValid,
    passwordsMatch,
    touched,
    handleBlur,
    success,
  } = useResetPasswordForm(token);
  const router = useRouter();
  if (success) {
    return (
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#22c55e" }} />
        <Typography variant="h5" fontWeight={700}>
          Password Reset!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your password has been successfully reset.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
          <Link href="/auth/login">Back to Login</Link>
        </Typography>
      </Box>
    );
  }
  return (
    <>
      <Headline title="Reset Password" description="Enter your new password." />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 2 }}>
        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && !isPasswordValid}
          helperText={
            touched.password && !isPasswordValid
              ? "Password must be at least 8 characters"
              : ""
          }
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            touched.confirmPassword &&
            !passwordsMatch &&
            form.confirmPassword.length > 0
          }
          helperText={
            touched.confirmPassword &&
            !passwordsMatch &&
            form.confirmPassword.length > 0
              ? "Passwords don't match."
              : ""
          }
        />
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || !isPasswordValid || !passwordsMatch}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
      <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
        <Link href="/auth/login">Back to Login</Link>
      </Typography>
    </>
  );
}
