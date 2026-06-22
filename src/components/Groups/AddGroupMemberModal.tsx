"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { addGroupMember } from "@/services/orgGroups";
import { getOrgUsers } from "@/services/orgUsers";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";
import { OrgMember } from "@/types/types";

type Props = {
  open: boolean;
  groupId: number;
  existingMemberIds: number[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddGroupMemberModal({
  open,
  groupId,
  existingMemberIds,
  onClose,
  onSuccess,
}: Props) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | "">("");
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedOrgId } = useUserContext();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!open || !selectedOrgId) return;
    getOrgUsers(selectedOrgId).then((response) => {
      setOrgMembers(response.data);
    });
  }, [open, selectedOrgId]);

  const availableMembers = orgMembers.filter(
    (m) => !existingMemberIds.includes(m.member_id),
  );

  const handleClose = () => {
    setSelectedMemberId("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedMemberId || !selectedOrgId) return;
    try {
      setLoading(true);
      await addGroupMember(selectedOrgId, groupId, Number(selectedMemberId));
      showSnackbar("Member added successfully", "success");
      onSuccess();
      handleClose();
    } catch {
      showSnackbar("Failed to add member.", "error");
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
            Add Member
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Select
          fullWidth
          displayEmpty
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value as number)}
          sx={{ mt: 1 }}
        >
          <MenuItem value="" disabled>
            Select member
          </MenuItem>
          {availableMembers.map((m) => (
            <MenuItem key={m.member_id} value={m.member_id}>
              {m.first_name} {m.last_name} ({m.email})
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedMemberId}
        >
          {loading ? "Adding..." : "Add Member"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
