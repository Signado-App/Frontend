"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Contract, OrgContract, OrgContractDetail } from "@/types/types";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useRef, useState } from "react";
import {
  completeContract,
  getOrgContract,
  getOrgContracts,
  updateOrgContract,
} from "@/services/orgContracts";
import { useSnackbar } from "@/context/SnackbarContext";
import { sha256 } from "js-sha256";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { List, ListItem, ListItemText } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  contract: OrgContract | null;
};

export default function ContractDetailModal({
  open,
  onClose,
  contract,
}: Props) {
  const { selectedOrgId } = useUserContext();
  const [detail, setDetail] = useState<OrgContractDetail | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ description: "", expires_at: "" });
  const [saving, setSaving] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!open || !contract || !selectedOrgId) return;
    getOrgContract(selectedOrgId, contract.id).then((response) => {
      setDetail(response.contract);
      setEditForm({
        description: response.contract?.description ?? "",
        expires_at: response.contract?.expires_at
          ? response.contract.expires_at.split("T")[0]
          : "",
      });
    });
  }, [open, contract]);

  if (!contract) return null;

  const handleSave = async () => {
    if (!selectedOrgId || !contract) return;
    try {
      setSaving(true);

      const filesData = await Promise.all(
        newFiles.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const hashHex = sha256(buffer);
          const bytes = new Uint8Array(hashHex.length / 2);
          for (let i = 0; i < hashHex.length; i += 2) {
            bytes[i / 2] = parseInt(hashHex.substring(i, i + 2), 16);
          }
          const hash = btoa(String.fromCharCode(...bytes));
          return { name: file.name, size: file.size, type: file.type, hash };
        }),
      );

      const response = await updateOrgContract(selectedOrgId, contract.id, {
        description: editForm.description,
        expires_at: editForm.expires_at
          ? new Date(editForm.expires_at).toISOString()
          : undefined,
        new_files: filesData.length > 0 ? filesData : undefined,
      });

      if (response.upload_urls && response.upload_urls.length > 0) {
        await Promise.all(
          response.upload_urls.map((uploadInfo: any, index: number) =>
            fetch(uploadInfo.upload_url, {
              method: "PUT",
              body: newFiles[index],
              headers: { "Content-Type": newFiles[index].type },
            }),
          ),
        );
        await completeContract(selectedOrgId, contract.id, "VERIFY");
      }

      showSnackbar("Contract updated successfully", "success");
      setEditMode(false);
      setNewFiles([]);
      getOrgContract(selectedOrgId, contract.id).then((r) =>
        setDetail(r.contract),
      );
    } catch {
      showSnackbar("Failed to update contract.", "error");
    } finally {
      setSaving(false);
    }
  };

  const colors: Record<string, { bg: string; text: string }> = {
    active: { bg: "#e0f2fe", text: "#0ea5e9" },
    signed: { bg: "#dcfce7", text: "#22c55e" },
    expired: { bg: "#f3f4f6", text: "#64748b" },
    draft: { bg: "#fef9c3", text: "#eab308" },
  };
  const style = colors[contract.status.toLowerCase()] ?? {
    bg: "#f3f4f6",
    text: "#64748b",
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Contract Details - {contract.id}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadOutlinedIcon />}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditOutlinedIcon />}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel Edit" : "Edit Contract"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReceiptOutlinedIcon />}
              >
                Create Invoice
              </Button>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            mt: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Contract Information
            </Typography>
            {[
              { label: "Contract Name:", value: contract.title },
              { label: "Contract Number:", value: contract.id },
              { label: "Description:", value: contract.description ?? "-" },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 140 }}
                >
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 140 }}
              >
                Status:
              </Typography>
              <Chip
                label={contract.status}
                size="small"
                sx={{
                  bgcolor: style.bg,
                  color: style.text,
                  fontWeight: 600,
                  borderRadius: "20px",
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Dates & Value
            </Typography>
            {[
              {
                label: "Created:",
                value: contract.created_at
                  ? new Date(contract.created_at).toLocaleString("cs-CZ")
                  : "-",
              },
              {
                label: "Expires:",
                value: contract.expires_at
                  ? new Date(contract.expires_at).toLocaleString("cs-CZ")
                  : "-",
              },
              {
                label: "Last Activity:",
                value: contract.last_activity
                  ? new Date(contract.last_activity).toLocaleString("cs-CZ")
                  : "-",
              },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 120 }}
                >
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {editMode && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Edit Contract
            </Typography>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={editForm.description}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <TextField
              label="Expires At"
              type="date"
              fullWidth
              value={editForm.expires_at}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, expires_at: e.target.value }))
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileOutlinedIcon />}
              sx={{ alignSelf: "flex-start" }}
            >
              Add Files
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>

            {newFiles.length > 0 && (
              <List dense>
                {newFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton onClick={() => removeNewFile(index)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{ alignSelf: "flex-start" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}
        <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1.5}>
          Signing Parties
        </Typography>
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {detail?.parties?.length ? (
            detail.parties.map((party, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderBottom:
                    i < detail.parties.length - 1
                      ? "1px solid #e5e7eb"
                      : "none",
                }}
              >
                <Typography variant="body2">{party.email ?? "-"}</Typography>
                <Chip label={party.status} size="small" />
              </Box>
            ))
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No parties
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1.5}>
          Attached Files
        </Typography>
        {/* Files */}
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {detail?.files?.length ? (
            detail.files.map((file, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderBottom:
                    i < detail.files.length - 1 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ color: "#64748b", fontSize: 20 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {file.file_type} •{" "}
                    {(file.size_bytes / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  component="a"
                  href={file.download_url}
                  target="_blank"
                >
                  <DownloadOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            ))
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No files attached
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="subtitle1" fontWeight={700} mt={3} mb={1.5}>
          Activity History
        </Typography>
        {/* Events */}
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {detail?.events?.length ? (
            detail.events.map((event, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderBottom:
                    i < detail.events.length - 1 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ color: "#94a3b8", fontSize: 20 }}
                />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {event.event_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.timestamp
                      ? new Date(event.timestamp).toLocaleString("cs-CZ")
                      : "-"}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No activity yet
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
