import React from "react";
import { requestPasswordReset } from "@/services/auth";

export function useForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isEmailValid) return;
    try {
      setLoading(true);
      await requestPasswordReset(email);
      setSent(true);
    } catch {
      setSent(true); // vždy zobraz success - bezpečnostní důvod
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, sent, loading, isEmailValid, handleSubmit };
}