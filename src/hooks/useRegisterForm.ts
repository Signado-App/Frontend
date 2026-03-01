import React from "react";
import { useRouter } from "next/navigation";

export function useRegisterForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({ firstName: "", lastName: "", email: "", password: "", 
    confirmPassword: "" });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const isPasswordValid = form.password.length >= 8;
  const passwordsMatch = form.password === form.confirmPassword;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
  setError(null);

  if (!isEmailValid) {
    setError("Invalid email address");
    return;
  }
  if (!isPasswordValid) {
    setError("Password must be at least 8 characters");
    return;
  }
  if (!passwordsMatch) {
    setError("Passwords don't match");
    return;
  }

  try {
    setLoading(true);
    // await api.register(form);
    router.push("/app/dashboard");
  } catch (e) {
    setError("Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return { form, error, loading, handleChange, handleSubmit, isPasswordValid, passwordsMatch, isEmailValid };
}