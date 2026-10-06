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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import {
  updateUserMemberships,
  getAvailableUserPrivileges,
  getOrgUser,
} from "@/services/orgUsers";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";

type Props = {
  open: boolean;
  memberId: number;
  userId?: number;
  candidateIds?: number[];
  currentPrivilegeIds: number[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUserPrivilegesModal({
  open,
  memberId,
  userId,
  candidateIds,
  currentPrivilegeIds,
  onClose,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [availablePrivileges, setAvailablePrivileges] = useState<
    { id: string | number; name: string; description?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPrivileges, setFetchingPrivileges] = useState(false);
  const { selectedOrgId } = useUserContext();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) setSelected(currentPrivilegeIds);
  }, [open, currentPrivilegeIds]);

  useEffect(() => {
    if (!open || !selectedOrgId) return;
    setFetchingPrivileges(true);
    getAvailableUserPrivileges(selectedOrgId)
      .then((response) => {
        const privs =
          response?.data?.available_privileges ||
          response?.available_privileges ||
          (Array.isArray(response?.data) ? response.data : []) ||
          (Array.isArray(response) ? response : []);
        setAvailablePrivileges(privs);
      })
      .catch((err) => {
        console.error("Failed to load available privileges:", err);
        setAvailablePrivileges([]);
      })
      .finally(() => {
        setFetchingPrivileges(false);
      });

    // Also fetch current privileges directly from getOrgUser if available
    if (memberId || userId) {
      getOrgUser(selectedOrgId, memberId, userId)
        .then((res) => {
          const u = res?.user ?? res?.data ?? res;
          const userPrivs = (u?.privileges || []).map((p: any) =>
            typeof p === "object" ? Number(p.id) : Number(p),
          );
          if (userPrivs.length > 0) {
            setSelected(userPrivs);
          }
        })
        .catch(() => {});
    }
  }, [open, selectedOrgId, memberId, userId]);

  const togglePrivilege = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!selectedOrgId) return;
    try {
      setLoading(true);
      await updateUserMemberships(
        selectedOrgId,
        memberId,
        selected,
        userId,
      );
      showSnackbar("User privileges updated successfully", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to update user privileges:", err);
      const msg =
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.data?.specification ||
        err?.message ||
        "Failed to update privileges.";
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
            Edit User Privileges
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {fetchingPrivileges ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : availablePrivileges.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
            No privileges available to assign.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxHeight: 400,
              overflowY: "auto",
              gap: 0.5,
            }}
          >
            {availablePrivileges.map((priv) => (
              <FormControlLabel
                key={String(priv.id)}
                control={
                  <Checkbox
                    checked={selected.includes(Number(priv.id))}
                    onChange={() => togglePrivilege(Number(priv.id))}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {priv.name}
                    </Typography>
                    {priv.description && (
                      <Typography variant="caption" color="text.secondary">
                        {priv.description}
                      </Typography>
                    )}
                  </Box>
                }
              />
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Privileges"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
