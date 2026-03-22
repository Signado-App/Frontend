// src/hooks/useCreateContractForm.ts
import React from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext";

export function useCreateContractForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    expires_at: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { showSnackbar } = useSnackbar();

  const isTitleValid = form.title.trim().length > 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isTitleValid) {
      showSnackbar("Title is required", "error");
      return;
    }

    try {
      setLoading(true);
      // await createContract(form);
      router.push("/app/contracts");
    } catch {
      showSnackbar("Failed to create contract. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return { form, error, loading, handleChange, handleSubmit, isTitleValid };
}
