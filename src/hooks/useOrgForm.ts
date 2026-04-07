import React from "react";

export function useOrgForm() {
  const [form, setForm] = React.useState({ name: "SupplierPro Solutions" });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // await updateOrganization(form);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}