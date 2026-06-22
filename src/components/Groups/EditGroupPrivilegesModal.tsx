"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { updateGroupPrivileges } from "@/services/orgGroups";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";
import { Privileges, PrivilegeLabels } from "@/constants/privileges";

type Props = {
  open: boolean;
  groupId: number;
  currentPrivilegeIds: number[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditGroupPrivilegesModal({
  open,
  groupId,
  currentPrivilegeIds,
  onClose,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedOrgId } = useUserContext();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) setSelected(currentPrivilegeIds);
  }, [open, currentPrivilegeIds]);

  const togglePrivilege = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!selectedOrgId) return;
    try {
      setLoading(true);
      await updateGroupPrivileges(selectedOrgId, groupId, selected.map(String));
      showSnackbar("Privileges updated successfully", "success");
      onSuccess();
      onClose();
    } catch {
      showSnackbar("Failed to update privileges.", "error");
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
            Edit Privileges
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {Object.values(Privileges).map((id) => (
            <FormControlLabel
              key={id}
              control={
                <Checkbox
                  checked={selected.includes(id)}
                  onChange={() => togglePrivilege(id)}
                />
              }
              label={PrivilegeLabels[id]}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Privileges"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
