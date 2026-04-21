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
  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPasswordValid &&
    passwordsMatch;
  // const [isPwnedPassword, setIsPwnedPassword] = React.useState(false);

  // React.useEffect(() => {
  //   setIsPwnedPassword(false);

  //   if (!isPasswordValid) return;

  //   const timer = setTimeout(async () => {
  //     try {
  //       const response = await checkPwnedPassword(form.password);

  //       setIsPwnedPassword(response.allowed);
  //     } catch (e) {
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [form.password, isPasswordValid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!isFormValid) return;

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
    // isPwnedPassword,
    isFirstNameValid,
    isLastNameValid,
    isFormValid
  };
}
