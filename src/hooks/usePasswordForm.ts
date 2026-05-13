import React from "react";
import { changePassword } from "@/services/user";
import { useSnackbar } from "@/context/SnackbarContext";

export function usePasswordForm() {
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = React.useState(false);

  const isNewPasswordValid = form.newPassword.length >= 8;
  const passwordsMatch = form.newPassword === form.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!isNewPasswordValid || !passwordsMatch) return;
    try {
      setLoading(true);
      await changePassword({
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      showSnackbar("Password changed successfully", "success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      showSnackbar(
        "Failed to change password. Check your current password.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleChange,
    handleSubmit,
    isNewPasswordValid,
    passwordsMatch,
  };
}
