import { useAuthContext } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";
import { updateOrganization } from "@/services/organizations";
import React from "react";

export function useOrgForm() {
  const { selectedOrgId, selectedOrg } = useUserContext();
  const { showSnackbar } = useSnackbar();
  const { refreshOrganizations } = useAuthContext();

  const [form, setForm] = React.useState({ name: "" });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (selectedOrg) {
      setForm({ name: selectedOrg.organization_name ?? "" });
    }
  }, [selectedOrg]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!selectedOrgId) return;
    try {
      setLoading(true);
      await updateOrganization(selectedOrgId, { name: form.name });
      showSnackbar("Organization updated successfully", "success");
      await refreshOrganizations();
    } catch {
      showSnackbar("Failed to update organization.", "error");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
