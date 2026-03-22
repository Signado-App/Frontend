import React from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth";
import { checkPwnedPassword } from "@/services/hibp";

export function useRegisterForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const isPasswordValid = form.password.length >= 8;
  const passwordsMatch = form.password === form.confirmPassword;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isFirstNameValid = form.firstName.trim().length > 0;
  const isLastNameValid = form.lastName.trim().length > 0;
  const [isPwnedPassword, setIsPwnedPassword] = React.useState(false);

  React.useEffect(() => {
    setIsPwnedPassword(false);

    if (!isPasswordValid) return;

    const timer = setTimeout(async () => {
      try {
        const found = await checkPwnedPassword(form.password);


        setIsPwnedPassword(found);
      } catch (e) {
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [form.password, isPasswordValid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isFirstNameValid) {
      setError("First name is required");
      return;
    }

    if (!isLastNameValid) {
      setError("Last name is required");
      return;
    }

    if (!isEmailValid) {
      setError("Invalid email address");
      return;
    }
    if (!isPasswordValid) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (isPwnedPassword) {
      setError("Please choose a different password");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      router.push("/app/dashboard");
    } catch (e) {
      setError("Registration failed. Please try again.");
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
    isPasswordValid,
    passwordsMatch,
    isEmailValid,
    isPwnedPassword,
    isFirstNameValid,
    isLastNameValid
  };
}
