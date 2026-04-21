import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth";
import { useAuthContext } from "@/context/AuthContext";

export function useLoginForm() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length >= 8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await loginUser(form);
      router.push("/app/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
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
  };
}
