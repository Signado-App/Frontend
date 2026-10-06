"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
  TextField,
  Paper,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { useAuthContext } from "@/context/AuthContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { usePrivileges } from "@/context/PrivilegesContext";
import { Privileges } from "@/constants/privileges";
import {
  getOrgContract,
  completeContract,
  updateOrgContract,
} from "@/services/orgContracts";
import { OrgContractDetail } from "@/types/types";
import StatusChip from "../StatusChip";
import ConfirmDialog from "../ConfirmDialog";

type ContractDetailViewProps = {
  contractId: string;
  onBack?: () => void;
  isModal?: boolean;
};

export default function ContractDetailView({
  contractId,
  onBack,
  isModal = false,
}: ContractDetailViewProps) {
  const router = useRouter();
  const { selectedOrgId } = useUserContext();
  const { organizations } = useAuthContext();
  const { showSnackbar } = useSnackbar();
  const { hasPrivilege } = usePrivileges();

  const [contract, setContract] = useState<OrgContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recipients" | "details">("recipients");

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // Cancel dialog
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!contractId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (selectedOrgId) {
      getOrgContract(selectedOrgId, contractId)
        .then((res) => {
          const data = res?.contract ?? res?.data ?? res;
          setContract(data);
          setEditDesc(data?.description || "");
        })
        .catch((err) => {
          console.error("Failed to load contract:", err);
          showSnackbar("Failed to load contract details", "error");
        })
        .finally(() => setLoading(false));
      return;
    }

    // When selectedOrgId is not set (e.g. client mode or direct URL):
    // Search for the contract across user's organizations
    if (organizations && organizations.length > 0) {
      let isMounted = true;
      (async () => {
        let foundData: any = null;
        for (const org of organizations) {
          try {
            const orgId = Number(org.organization_id);
            const res = await getOrgContract(orgId, contractId);
            const data = res?.contract ?? res?.data ?? res;
            if (data && (data.id === contractId || data.title)) {
              foundData = data;
              break;
            }
          } catch {
            // not in this organization, try next
          }
        }
        if (isMounted) {
          if (foundData) {
            setContract(foundData);
            setEditDesc(foundData.description || "");
          } else {
            showSnackbar("Contract details not found in your organizations.", "warning");
          }
          setLoading(false);
        }
      })();
      return () => {
        isMounted = false;
      };
    }

    // No organization available to load contract from
    setLoading(false);
  }, [selectedOrgId, contractId, organizations, showSnackbar]);

  const getActiveOrgId = () => {
    if (selectedOrgId) return selectedOrgId;
    if ((contract as any)?.organization_id) return Number((contract as any).organization_id);
    if (organizations && organizations.length > 0) {
      return Number(organizations[0].organization_id);
    }
    return null;
  };

  const handleCopyId = () => {
    if (!contract?.id) return;
    navigator.clipboard.writeText(contract.id);
    showSnackbar("Envelope ID copied to clipboard", "success");
  };

  const handleSaveEdit = async () => {
    const orgIdToUse = getActiveOrgId();
    if (!orgIdToUse || !contract) return;
    try {
      setSaving(true);
      await updateOrgContract(orgIdToUse, contract.id, {
        description: editDesc,
      });
      setContract((prev) => (prev ? { ...prev, description: editDesc } : null));
      setEditMode(false);
      showSnackbar("Contract updated successfully", "success");
    } catch {
      showSnackbar("Failed to update contract", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelContract = async () => {
    const orgIdToUse = getActiveOrgId();
    if (!orgIdToUse || !contract) return;
    try {
      setCancelling(true);
      await completeContract(orgIdToUse, contract.id, "CANCEL");
      showSnackbar("Contract cancelled successfully", "success");
      setCancelOpen(false);
      setContract((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
    } catch {
      showSnackbar("Failed to cancel contract", "error");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 350 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!contract) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Contract not found
        </Typography>
        <Button onClick={onBack || (() => router.push("/app/contracts"))} sx={{ mt: 2 }}>
          Back to Contracts
        </Button>
      </Box>
    );
  }

  const files = contract.files || [];
  const isCompleted = ["SIGNED", "COMPLETED"].includes(contract.status);

  const isSignedFileName = (name?: string) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return lower.includes("signed") || lower.includes("podepsan");
  };

  // Signed files list (ordered chronologically as appended by subsequent signers)
  const signedFiles = files.filter((f) => isSignedFileName(f.name));

  // The true final signed file is the LATEST signed file in the list,
  // which contains cumulative signatures from both parties!
  const signedFile =
    signedFiles.length > 0
      ? signedFiles[signedFiles.length - 1]
      : (isCompleted && files.length > 1 ? files[files.length - 1] : null);

  // Original files: files that are NOT signed files and not the signed file
  const originalFiles = files.filter(
    (f) => !isSignedFileName(f.name) && f !== signedFile,
  );

  // Fallback if all files were named signed or no separate original file was found
  const displayOriginalFiles =
    originalFiles.length > 0
      ? originalFiles
      : (files.length > 1 && files[0] !== signedFile ? [files[0]] : []);

  const primaryDownloadFile =
    isCompleted && signedFile ? signedFile : displayOriginalFiles[0] || files[0] || null;

  const parties = contract.parties || [];
  const signedParties = parties.filter(
    (p) => p.status === "SIGNED" || p.status === "COMPLETED",
  );
  const signedCount = signedParties.length;
  const totalCount = parties.length;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString("cs-CZ");
  };

  const handleDownloadFile = async (url?: string, filename?: string) => {
    if (!url) {
      showSnackbar("Download URL is not available", "error");
      return;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404 || res.status === 403) {
          showSnackbar(
            "This file was not found on S3 storage. The upload during signing might have failed.",
            "error",
          );
          return;
        }
        throw new Error(`Download failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "contract.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      showSnackbar("Download started", "success");
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", pb: isModal ? 2 : 6 }}>
      {/* Top Breadcrumb / Back button (if not in modal) */}
      {!isModal && (
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={onBack || (() => router.push("/app/contracts"))}
            sx={{
              textTransform: "none",
              color: "#64748b",
              fontWeight: 600,
              fontSize: "0.875rem",
              p: 0,
              "&:hover": { bgcolor: "transparent", color: "#0f172a" },
            }}
          >
            Contracts
          </Button>
        </Box>
      )}

      {/* Header bar matching screenshot */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
              {contract.title}
            </Typography>
            <StatusChip status={contract.status} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75, color: "#64748b", fontSize: "0.85rem" }}>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Envelope ID: <strong style={{ color: "#334155" }}>{contract.id.slice(0, 8)}</strong>
            </Typography>
            <Tooltip title="Copy full Envelope ID">
              <IconButton size="small" onClick={handleCopyId} sx={{ p: 0.25, color: "#94a3b8" }}>
                <ContentCopyRoundedIcon sx={{ fontSize: "0.95rem" }} />
              </IconButton>
            </Tooltip>
            {contract.created_at && (
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                • Created {formatDate(contract.created_at)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {signedFile?.download_url ? (
            <Button
              variant="contained"
              startIcon={<DownloadRoundedIcon />}
              onClick={() =>
                handleDownloadFile(
                  signedFile.download_url,
                  signedFile.name || "signed_contract.pdf",
                )
              }
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                color: "#ffffff",
                bgcolor: "#5046e5",
                px: 2,
                py: 0.8,
                boxShadow: "0 2px 4px rgba(80, 70, 229, 0.25)",
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Download signed document
            </Button>
          ) : primaryDownloadFile?.download_url ? (
            <Button
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={() =>
                handleDownloadFile(
                  primaryDownloadFile.download_url,
                  primaryDownloadFile.name || "contract.pdf",
                )
              }
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                color: "#1e293b",
                borderColor: "#e2e8f0",
                bgcolor: "#ffffff",
                px: 2,
                py: 0.8,
                "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
              }}
            >
              Download document
            </Button>
          ) : null}

          {signedFile && displayOriginalFiles[0]?.download_url && (
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                handleDownloadFile(
                  displayOriginalFiles[0].download_url,
                  displayOriginalFiles[0].name || "original_contract.pdf",
                )
              }
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                color: "#64748b",
                borderColor: "#e2e8f0",
                bgcolor: "#ffffff",
                px: 1.5,
                py: 0.8,
                "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
              }}
            >
              Download original
            </Button>
          )}

          {hasPrivilege(Privileges.UPDATE_CONTRACTS) &&
            !["SIGNED", "CANCELLED", "EXPIRED"].includes(contract.status) && (
              <Button
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                onClick={() => setEditMode(!editMode)}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 1.75,
                  py: 0.8,
                }}
              >
                {editMode ? "Cancel edit" : "Edit"}
              </Button>
            )}

          {!["SIGNED", "CANCELLED", "EXPIRED"].includes(contract.status) && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setCancelOpen(true)}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                px: 1.75,
                py: 0.8,
              }}
            >
              Cancel contract
            </Button>
          )}
        </Box>
      </Box>

      {/* Main 2-Column Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left Card: Recipients & Details */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
            bgcolor: "#ffffff",
            p: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {/* Card Header with Segmented Switcher */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
              pb: 2,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {activeTab === "recipients" ? "Recipients" : "Envelope Details"}
              </Typography>
              {activeTab === "recipients" && (
                <Chip
                  label={`Signed ${signedCount} of ${totalCount}`}
                  size="small"
                  sx={{
                    bgcolor: "#f1f5f9",
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                  }}
                />
              )}
            </Box>

            {/* Segmented Switcher Buttons */}
            <Box
              sx={{
                bgcolor: "#f1f5f9",
                borderRadius: "10px",
                p: 0.4,
                display: "inline-flex",
                gap: 0.5,
              }}
            >
              <Button
                size="small"
                onClick={() => setActiveTab("recipients")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.825rem",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  color: activeTab === "recipients" ? "#0f172a" : "#64748b",
                  bgcolor: activeTab === "recipients" ? "#ffffff" : "transparent",
                  boxShadow:
                    activeTab === "recipients"
                      ? "0 1px 2px rgba(0,0,0,0.08)"
                      : "none",
                  "&:hover": {
                    bgcolor: activeTab === "recipients" ? "#ffffff" : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Recipients ({parties.length})
              </Button>
              <Button
                size="small"
                onClick={() => setActiveTab("details")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.825rem",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  color: activeTab === "details" ? "#0f172a" : "#64748b",
                  bgcolor: activeTab === "details" ? "#ffffff" : "transparent",
                  boxShadow:
                    activeTab === "details"
                      ? "0 1px 2px rgba(0,0,0,0.08)"
                      : "none",
                  "&:hover": {
                    bgcolor: activeTab === "details" ? "#ffffff" : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Details
              </Button>
            </Box>
          </Box>

          {/* Tab 1: Recipients List */}
          {activeTab === "recipients" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {parties.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#64748b", py: 3, textAlign: "center" }}>
                  No recipients added to this contract.
                </Typography>
              ) : (
                parties.map((party, index) => {
                  const isSigned = party.status === "SIGNED" || party.status === "COMPLETED";
                  return (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: "14px",
                        border: "1px solid #f1f5f9",
                        bgcolor: "#faf8f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
                        {/* Circle Status Icon */}
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            bgcolor: isSigned ? "#dcfce7" : "#fef3c7",
                            color: isSigned ? "#16a34a" : "#d97706",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSigned ? (
                            <CheckCircleRoundedIcon sx={{ fontSize: "1.3rem" }} />
                          ) : (
                            <ScheduleRoundedIcon sx={{ fontSize: "1.3rem" }} />
                          )}
                        </Box>

                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                              {party.email || `Party ${party.user_id}`}
                            </Typography>
                            <StatusChip status={party.status} />
                          </Box>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            Role: {party.role || "Signer"}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Right info */}
                      <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                        {isSigned ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#16a34a", fontSize: "0.8rem", fontWeight: 600 }}>
                            <DrawOutlinedIcon sx={{ fontSize: "1rem" }} />
                            <span>Digitally signed</span>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: "#d97706", fontWeight: 600 }}>
                            Waiting for signature
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>
          )}

          {/* Tab 2: Envelope Details matching screenshot */}
          {activeTab === "details" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Properties Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Contract Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.5 }}>
                    {contract.title}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Envelope ID
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
                      {contract.id}
                    </Typography>
                    <IconButton size="small" onClick={handleCopyId} sx={{ p: 0.25 }}>
                      <ContentCopyRoundedIcon sx={{ fontSize: "0.9rem" }} />
                    </IconButton>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Signature Level
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.5 }}>
                    Simple electronic signature (SES) – eIDAS compliant
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.5 }}>
                    {formatDate(contract.created_at)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Expires
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.5 }}>
                    {contract.expires_at ? formatDate(contract.expires_at) : "No expiration set"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Last Activity
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", mt: 0.5 }}>
                    {formatDate(contract.last_activity)}
                  </Typography>
                </Box>
              </Box>

              {/* Message for recipients */}
              {contract.description && (
                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1 }}>
                    Message for recipients
                  </Typography>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "#f5f3ff",
                      border: "1px solid #ede9fe",
                      color: "#334155",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {contract.description}
                  </Box>
                </Box>
              )}

              {/* Edit Form if enabled */}
              {editMode && (
                <Box sx={{ mt: 2, p: 2.5, borderRadius: "14px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Edit Message / Description
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Enter message for signers..."
                  />
                  <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveEdit}
                      disabled={saving}
                      sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#5046e5" }}
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>

        {/* Right Column: Document & Signature Record */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Document Card matching screenshot */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid #f1f5f9",
              bgcolor: "#ffffff",
              p: 2.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PictureAsPdfOutlinedIcon sx={{ color: "#ef4444", fontSize: "1.2rem" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {signedFile ? "Documents" : "Document"}
                </Typography>
              </Box>
              {primaryDownloadFile && (
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                  {(primaryDownloadFile.size_bytes / 1024 / 1024).toFixed(1)} MB
                </Typography>
              )}
            </Box>

            {/* Document Preview Box */}
            <Box
              sx={{
                height: 180,
                borderRadius: "14px",
                bgcolor: "#faf8f5",
                border: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                p: 2,
                textAlign: "center",
              }}
            >
              <PictureAsPdfOutlinedIcon
                sx={{
                  fontSize: "2.5rem",
                  color: signedFile ? "#10b981" : "#94a3b8",
                }}
              />
              {signedFile ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(signedFile.download_url, "_blank")}
                  startIcon={<VisibilityOutlinedIcon />}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    bgcolor: "#ffffff",
                    borderColor: "#e2e8f0",
                    color: "#1e293b",
                    "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                  }}
                >
                  View signed document
                </Button>
              ) : primaryDownloadFile ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    window.open(primaryDownloadFile.download_url, "_blank")
                  }
                  startIcon={<VisibilityOutlinedIcon />}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    bgcolor: "#ffffff",
                    borderColor: "#e2e8f0",
                    color: "#1e293b",
                    "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                  }}
                >
                  View document
                </Button>
              ) : (
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  No preview available
                </Typography>
              )}
            </Box>

            {/* Document List / Footer */}
            {signedFile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                  pt: 1.5,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <Box sx={{ minWidth: 0, mr: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {signedFile.name}
                    </Typography>
                    <Chip
                      label="Signed"
                      size="small"
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#166534",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        height: 20,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    PDF • {(signedFile.size_bytes / 1024 / 1024).toFixed(1)} MB
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  onClick={() =>
                    handleDownloadFile(
                      signedFile.download_url,
                      signedFile.name || "signed_contract.pdf",
                    )
                  }
                  sx={{ color: "#475569" }}
                  title="Download signed document"
                >
                  <DownloadRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {displayOriginalFiles.map((file, idx) => (
              <Box
                key={file.file_id || idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: signedFile ? 1.5 : 2,
                  pt: 1.5,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <Box sx={{ minWidth: 0, mr: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.name}
                    </Typography>
                    {signedFile && (
                      <Chip
                        label={isCompleted ? "Original" : "Draft"}
                        size="small"
                        sx={{
                          bgcolor: "#f1f5f9",
                          color: "#475569",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    PDF • {(file.size_bytes / 1024 / 1024).toFixed(1)} MB
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  onClick={() =>
                    handleDownloadFile(
                      file.download_url,
                      file.name || "contract.pdf",
                    )
                  }
                  sx={{ color: "#475569" }}
                  title="Download document"
                >
                  <DownloadRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Paper>

          {/* Signature Record Card matching screenshot */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid #f1f5f9",
              bgcolor: "#ffffff",
              p: 2.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <SecurityOutlinedIcon sx={{ color: "#6366f1", fontSize: "1.2rem" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                Signature Record
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.5, mb: 2 }}>
              Signed {signedCount} of {totalCount}. Certified audit trail available for all parties.
            </Typography>

            {/* Event logs if any exist */}
            {contract.events && contract.events.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1, borderTop: "1px solid #f1f5f9" }}>
                {contract.events.slice(0, 3).map((event, idx) => (
                  <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
                      {event.event_type}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      {formatDate(event.timestamp)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelOpen}
        title="Cancel Contract"
        description="Are you sure you want to cancel this contract? Signers will no longer be able to sign it."
        confirmLabel={cancelling ? "Cancelling..." : "Yes, cancel contract"}
        onConfirm={handleCancelContract}
        onClose={() => setCancelOpen(false)}
      />
    </Box>
  );
}
