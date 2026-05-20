"use client";

import { Box, Button, TextField, Typography, Link } from "@mui/material";
import Headline from "@/components/Headline";
import { useForgotPasswordForm } from "@/hooks/useForgotPasswordForm";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function ForgotPasswordPage() {
  const { email, setEmail, sent, loading, isEmailValid, handleSubmit } =
    useForgotPasswordForm();

  if (sent) {
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
          Check your email
        </Typography>
        <Typography variant="body1" color="text.secondary">
          If the email exists, you will receive a password reset link.
        </Typography>
        <Link href="/auth/login">Back to Login</Link>
      </Box>
    );
  }

  return (
    <>
      <Headline
        title="Forgot Password"
        description="Enter your email to receive a password reset link."
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
        <TextField
          id="email"
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email.length > 0 && !isEmailValid}
          helperText={
            email.length > 0 && !isEmailValid ? "Invalid email address" : ""
          }
        />
      </Box>
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || !isEmailValid}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
      <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
        <Link href="/auth/login">Back to Login</Link>
      </Typography>
    </>
  );
}
