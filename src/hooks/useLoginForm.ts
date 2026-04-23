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
  const [form, setForm] = useState({ email: "", password: "" });
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
      showSnackbar("Login successful!", "success");
      console.log(data);
      // login(data);
      router.push("/app/dashboard");
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        setError("Invalid email or password");
      } else if (err instanceof AccountNotActiveError) {
        showSnackbar(
          "Account is not activated. Please verify your email.",
          "error",
        );
      } else if (err instanceof NetworkError) {
        showSnackbar("Cannot connect to server. Check your internet.", "error");
      } else if (err instanceof ServerError) {
        showSnackbar("Server error. Please try again in a moment.", "error");
      } else {
        showSnackbar("Login failed. Please try again.", "error");
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
