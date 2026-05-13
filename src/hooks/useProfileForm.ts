import { useAuthContext } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { updateUser } from "@/services/user";
import React, { useEffect, useState } from "react";

export function useProfileForm() {
  const { user } = useAuthContext();

  const [email, setEmail] = useState(user?.email ?? "");
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateUser(form);
      showSnackbar("Profile updated successfully", "success");
    } catch {
      showSnackbar("Failed to update profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit, email };
}
