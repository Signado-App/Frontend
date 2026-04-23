import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  registerUser,
} from "@/services/auth";
import { useSnackbar } from "@/context/SnackbarContext";
import { EmailAlreadyExistsError, NetworkError, ServerError, ValidationError } from "@/services/errors";

export function useRegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const isPasswordValid = form.password.length >= 8;
  const passwordsMatch = form.password === form.confirmPassword;
  const { showSnackbar } = useSnackbar();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isFirstNameValid = form.firstName.trim().length > 0;
  const isLastNameValid = form.lastName.trim().length > 0;
  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPasswordValid &&
    passwordsMatch;
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };
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
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setFieldErrors({});
    if (!isFormValid) return;

    try {
      setLoading(true);
      await registerUser({
        name: form.firstName,
        surname: form.lastName,
        email: form.email,
        password: form.password,
      });
      showSnackbar("Registration successful! Check your email.", "success");
    } catch (err) {
      if (err instanceof EmailAlreadyExistsError) {
        setFieldErrors({ email: "This email is already registered" });
      } else if (err instanceof ValidationError) {
        const mapped: Record<string, string> = {};
        if (err.fields.name) mapped.firstName = err.fields.name;
        if (err.fields.surname) mapped.lastName = err.fields.surname;
        if (err.fields.email) mapped.email = err.fields.email;
        if (err.fields.password) mapped.password = err.fields.password;
        setFieldErrors(mapped);
      } else if (err instanceof NetworkError) {
        showSnackbar("Cannot connect to server. Check your internet.", "error");
      } else if (err instanceof ServerError) {
        showSnackbar("Server error. Please try again in a moment.", "error");
      } else {
        showSnackbar("Registration failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    fieldErrors,
    loading,
    handleChange,
    handleSubmit,
    isPasswordValid,
    passwordsMatch,
    isEmailValid,
    // isPwnedPassword,
    isFirstNameValid,
    isLastNameValid,
    isFormValid,
    touched,
    handleBlur,
  };
}
