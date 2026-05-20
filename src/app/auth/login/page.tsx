"use client";
import Headline from "@/components/Headline";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Box, Button, Link, TextField, Typography } from "@mui/material";

export default function LoginPage() {
  const {
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
    isEmailValid,
    isPasswordValid,
    isFormValid,
    touched,
    handleBlur,
  } = useLoginForm();

  return (
    <>
      <Headline
        title="Login Page"
        description="Welcome to the login page. Please click the button below to log in."
      />
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
      >
        <TextField
          id="email"
          name="email"
          label="E-mail"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && !isEmailValid}
          helperText={
            touched.email && !isEmailValid ? "Invalid email address" : ""
          }
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
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
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={loading || !isFormValid}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Box>

      <Box sx={{ mt: 1, textAlign: "center" }}>
        <Typography variant="body1">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register">Register here</Link>.
        </Typography>
        <Typography variant="body2">
          <Link href="/auth/forgot-password">Forgot password?</Link>
        </Typography>
      </Box>
    </>
  );
}
