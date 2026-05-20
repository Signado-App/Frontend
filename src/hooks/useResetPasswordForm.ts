import React from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/auth";
import { useSnackbar } from "@/context/SnackbarContext";

export function useResetPasswordForm(token: string) {
  const router = useRouter();
  const [form, setForm] = React.useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const isPasswordValid = form.password.length >= 8;
  const passwordsMatch = form.password === form.confirmPassword;
  const [touched, setTouched] = React.useState({
    password: false,
    confirmPassword: false,
  });
  const { showSnackbar } = useSnackbar();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!isPasswordValid || !passwordsMatch) return;
    try {
      setLoading(true);
      await resetPassword(token, form.password);
      setSuccess(true);
      showSnackbar("Password successfully reset!", "success");
    } catch {
      showSnackbar("Reset failed. The link may have expired.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
