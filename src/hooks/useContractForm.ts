// src/hooks/useCreateContractForm.ts
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";
import { OrgClient } from "@/types/types";
import { getOrgClients } from "@/services/orgClients";
import { createOrgContract } from "@/services/orgContracts";
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
  const [parties, setParties] = useState<
    {
      user_id: any;
      email: string;
      role: string;
    }[]
  >([]);
  const [partyEmail, setPartyEmail] = useState("");
  const { selectedOrgId } = useUserContext();
  const [orgClients, setOrgClients] = useState<OrgClient[]>([]);

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgClients(selectedOrgId).then((response) => {
      setOrgClients(response.clients);
    });
  }, [selectedOrgId]);
  const addParty = () => {
    if (!partyEmail) return;
    setParties((prev) => [
      ...prev,
      { user_id: null, email: partyEmail, role: "SIGNER" },
    ]);
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
    if (!isTitleValid || !selectedOrgId) return;
    try {
      setLoading(true);
      await createOrgContract(selectedOrgId, {
        title: form.title,
        description: form.description,
        expires_at: form.expires_at
          ? new Date(form.expires_at).toISOString()
          : "",
        parties: parties.map((p) => p.user_id),
        files: [],
        min_verification: "LOGIN",
        sign_by: new Date(form.expires_at).toISOString(),
        reminders: {
          frequency: 0,
          frequency_type: "DAY",
        },
        use_order_send: true,
        category: ["rental"],
        copy_recipients: [],
        message: "",
      });
      showSnackbar("Contract created successfully", "success");
      router.push("/app/contracts");
    } catch {
      showSnackbar("Failed to create contract.", "error");
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
    setParties,
    partyEmail,
    setPartyEmail,
    orgClients,
  };
}
