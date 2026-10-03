import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  AccountNotActiveError,
  InvalidCredentialsError,
  NetworkError,
  ServerError,
} from "@/services/errors";

export function useLoginForm() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [form, setForm] = useState({
    email: "test@signado.cz",
    password: "123123123",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;
  const { showSnackbar } = useSnackbar();
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!isFormValid) return;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError(null);
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = await loginUser(form);
      console.log("[Login] Full response:", data);
      await login(data.data.access_csrf, data.data.refresh_csrf);
      showSnackbar("Login successful!", "success");
      console.log(data);
      router.push("/app/dashboard");
    } catch (err: any) {
      console.error("[Login] Error during login:", err);
      if (
        err instanceof InvalidCredentialsError ||
        err?.status === 401 ||
        err?.type === "UNAUTHORIZED"
      ) {
        setError("Invalid email or password");
      } else if (err instanceof AccountNotActiveError || err?.status === 403) {
        showSnackbar(
          "Account is not activated. Please verify your email.",
          "error",
        );
      } else if (err instanceof NetworkError || err?.type === "NETWORK_ERROR") {
        showSnackbar("Cannot connect to server. Check your internet.", "error");
      } else if (
        err instanceof ServerError ||
        (err?.status && err.status >= 500)
      ) {
        showSnackbar("Server error. Please try again in a moment.", "error");
      } else {
        setError(
          err?.message || "Login failed. Please check your credentials.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
