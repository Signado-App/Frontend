import React from "react";

export function useProfileForm() {
  const [form, setForm] = React.useState({
    firstName: "Martin",
    lastName: "Novák",
    phone: "+420 777 123 456",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // await updateProfile(form);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
