// src/hooks/useCreateContractForm.ts
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";
import { OrgClient } from "@/types/types";
import { getOrgClients } from "@/services/orgClients";

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
  const [files, setFiles] = useState<File[]>([]);
  const [parties, setParties] = useState<{ email: string; role: string }[]>([]);
  const [partyEmail, setPartyEmail] = useState("");
  const { selectedOrgId } = useUserContext();
  const [orgClients, setOrgClients] = useState<OrgClient[]>([]);

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgClients(selectedOrgId).then((response) => {
      setOrgClients(response.data);
    });
  }, [selectedOrgId]);
  const addParty = () => {
    if (!partyEmail) return;
    setParties((prev) => [...prev, { email: partyEmail, role: "SIGNER" }]);
    setPartyEmail("");
  };

  const removeParty = (index: number) => {
    setParties((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

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

  return {
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
    isTitleValid,
    files,
    setFiles,
    handleFileChange,
    removeFile,
    addParty,
    removeParty,
    parties,
    partyEmail,
    setPartyEmail,
    orgClients,
  };
}
