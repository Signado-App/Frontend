"use client";
import Headline from "@/components/Headline";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Box, Button, Link, TextField, Typography } from "@mui/material";

export default function RegisterPage() {
  const {
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
    isPasswordValid,
    passwordsMatch,
    isEmailValid,
    isPwnedPassword,
    isFirstNameValid,
    isLastNameValid,
  } = useRegisterForm();

  return (
    <>
      <Headline
        title="Register"
        description="Welcome to Signado. Please fill in the details below to create an account."
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <TextField
            name="firstName"
            label="First Name"
            value={form.firstName}
            onChange={handleChange}
            error={form.firstName.length > 0 && !isFirstNameValid}
            helperText={
              form.firstName.length > 0 && !isFirstNameValid
                ? "First name is required"
                : ""
            }
            sx={{ flex: 1 }}
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={form.lastName}
            onChange={handleChange}
            error={form.lastName.length > 0 && !isLastNameValid}
            helperText={
              form.lastName.length > 0 && !isLastNameValid
                ? "Last name is required"
                : ""
            }
            sx={{ flex: 1 }}
          />
        </Box>
        <TextField
          name="email"
          label="E-mail"
          value={form.email}
          onChange={handleChange}
          error={form.email.length > 0 && !isEmailValid}
          helperText={
            form.email.length > 0 && !isEmailValid
              ? "Invalid email address"
              : ""
          }
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          variant="outlined"
          value={form.password}
          onChange={handleChange}
          error={form.password.length > 0 && !isPasswordValid}
          helperText={
            form.password.length > 0 && !isPasswordValid
              ? "Password must be at least 8 characters"
              : ""
          }
        />
        {isPwnedPassword && (
          <Typography variant="body2" color="error">
            This password has been found in data breaches. Please choose a
            different one.
          </Typography>
        )}
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={form.confirmPassword.length > 0 && !passwordsMatch}
          helperText={
            form.confirmPassword.length > 0 && !passwordsMatch
              ? "Passwords don't match."
              : ""
          }
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ width: "100%" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          By registering, you agree to our{" "}
          <Link href="/terms-of-service">Terms of Service</Link> and{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Do you already have an account?{" "}
          <Link href="/auth/login">Login here</Link>.
        </Typography>
      </Box>
    </>
  );
}
