import React from "react";

export function usePasswordForm() {
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
      // await changePassword(form);
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
