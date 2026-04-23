"use client";
import Headline from "@/components/Headline";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Box, Button, Link, TextField, Typography } from "@mui/material";

export default function RegisterPage() {
  const {
    form,
    fieldErrors,
    loading,
    handleChange,
    handleSubmit,
    isPasswordValid,
    passwordsMatch,
    isEmailValid,
    // isPwnedPassword,
    isFirstNameValid,
    isLastNameValid,
    isFormValid,
    touched,
    handleBlur,
  } = useRegisterForm();

  return (
    <>
      <Headline
        title="Register"
        description="Welcome to Signado. Please fill in the details below to create an account."
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
        noValidate
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <TextField
            name="firstName"
            label="First Name"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && !isFirstNameValid}
            helperText={
              fieldErrors.firstName ||
              (touched.firstName && !isFirstNameValid
                ? "First name is required"
                : "")
            }
            sx={{ flex: 1 }}
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={form.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && !isLastNameValid}
            helperText={
              fieldErrors.lastName ||
              (touched.lastName && !isLastNameValid
                ? "Last name is required"
                : "")
            }
            sx={{ flex: 1 }}
          />
        </Box>
        <TextField
          name="email"
          label="E-mail"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={(touched.email && !isEmailValid) || !!fieldErrors.email}
          helperText={
            fieldErrors.email ||
            (touched.email && !isEmailValid ? "Invalid email address" : "")
          }
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            (touched.password && !isPasswordValid) || !!fieldErrors.password
          }
          helperText={
            fieldErrors.password ||
            (touched.password && !isPasswordValid
              ? "Password must be at least 8 characters"
              : "")
          }
        />
        {/* {isPwnedPassword && (
          <Typography variant="body2" color="error">
            This password has been found in data breaches. Please choose a
            different one.
          </Typography>
        )} */}
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
            form.confirmPassword.length > 0 &&
            !passwordsMatch
              ? "Passwords don't match."
              : ""
          }
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading || !isFormValid}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
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
