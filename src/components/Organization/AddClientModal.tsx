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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { addOrgClient } from "@/services/orgClients";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddClientModal({ open, onClose, onSuccess }: Props) {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectedOrgId } = useUserContext();
  const { showSnackbar } = useSnackbar();

  const handleClose = () => {
    setClientName("");
    setEmail("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!clientName || !email || !selectedOrgId) return;
    try {
      setLoading(true);
      await addOrgClient(selectedOrgId, {
        client_name: clientName,
        email: email,
      });
      showSnackbar("Client added successfully", "success");
      onSuccess();
      handleClose();
    } catch {
      showSnackbar("Failed to add client.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Add Client
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helperText="Enter the email of the client"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !clientName || !email}
        >
          {loading ? "Adding..." : "Add Client"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
