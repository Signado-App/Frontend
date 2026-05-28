"use client";

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, IconButton, Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { inviteOrgUser } from "@/services/orgUsers";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function InviteUserModal({ open, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedOrgId } = useUserContext();
  const { showSnackbar } = useSnackbar();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isEmailValid || !selectedOrgId) return;
    try {
      setLoading(true);
      await inviteOrgUser(selectedOrgId, { email, groups: [] });
      showSnackbar("User invited successfully", "success");
      setEmail("");
      onSuccess();
      onClose();
    } catch {
      setError("Failed to invite user. Check if the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={700}>Invite User</Typography>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email.length > 0 && !isEmailValid || !!error}
            helperText={email.length > 0 && !isEmailValid ? "Invalid email address" : error ?? ""}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !isEmailValid}>
          {loading ? "Inviting..." : "Invite User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}