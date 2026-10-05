"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { updateOrgClient } from "@/services/orgClients";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";
import { OrgClientDetail } from "@/types/types";

type Props = {
  open: boolean;
  client: OrgClientDetail;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditClientModal({
  open,
  client,
  onClose,
  onSuccess,
}: Props) {
  const { selectedOrgId } = useUserContext();
  const { showSnackbar } = useSnackbar();

  const [clientName, setClientName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && client) {
      setClientName(client.client_name ?? "");
      setFirstName(client.user_details?.first_name ?? "");
      setLastName(client.user_details?.last_name ?? "");
      setEmail(client.user_details?.email ?? "");
      setPhone(
        (client.client_metadata?.phone as string) ??
          (client.client_metadata?.phone_number as string) ??
          "",
      );
      setAddress((client.client_metadata?.address as string) ?? "");
    }
  }, [open, client]);

  const handleSubmit = async () => {
    if (!selectedOrgId || !client) return;
    if (!clientName.trim()) {
      showSnackbar("Client name is required", "error");
      return;
    }

    try {
      setLoading(true);
      await updateOrgClient(selectedOrgId, client.id, {
        client_name: clientName.trim(),
        email: email.trim(),
        client_metadata: {
          ...(client.client_metadata || {}),
          address: address.trim(),
          phone: phone.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          contact_person: `${firstName.trim()} ${lastName.trim()}`.trim(),
        },
      });

      showSnackbar("Client details updated successfully", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to update client:", err);
      const msg =
        err?.response?.data?.message ||
        err?.data?.message ||
        "Failed to update client details.";
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Edit Client Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Client / Company Name"
            fullWidth
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Contact First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Contact Last Name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>

          <TextField
            label="Contact Email"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            label="Address"
            fullWidth
            multiline
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
