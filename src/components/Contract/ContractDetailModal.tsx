"use client";

import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { OrgContract } from "@/types/types";
import ContractDetailView from "./ContractDetailView";

type Props = {
  open: boolean;
  onClose: () => void;
  contract: OrgContract | null;
};

export default function ContractDetailModal({ open, onClose, contract }: Props) {
  if (!contract) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            p: { xs: 1.5, md: 2.5 },
            bgcolor: "#faf8f5",
            position: "relative",
          },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          color: "#64748b",
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: { xs: 1, sm: 2 }, mt: 1 }}>
        <ContractDetailView contractId={contract.id} onBack={onClose} isModal />
      </DialogContent>
    </Dialog>
  );
}
