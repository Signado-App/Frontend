"use client";

import { use, useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dynamic from "next/dynamic";
import { loginWithSigningToken } from "@/services/auth";
import {
  getSigningContract,
  signContract,
  uploadSignedContract,
  uploadFileToPresignedUrl,
  SignedFileMeta,
} from "@/services/signing";
import { embedSignatureIntoPdf, readPdfFields } from "@/utils/pdfSigning";
import { sha256 } from "js-sha256";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const SigningDocumentViewer = dynamic(
  () => import("@/components/Contract/SigningDocumentViewer"),
  { ssr: false },
);

export default function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [contract, setContract] = useState<any>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [resolvedPartyKey, setResolvedPartyKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [getSignatureDataUrl, setGetSignatureDataUrl] = useState<
    () => string | null
  >(() => () => null);
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [isAlreadySigned, setIsAlreadySigned] = useState(false);
  const [alreadySignedDialogOpen, setAlreadySignedDialogOpen] = useState(false);

  const loadPdfFromUrl = useCallback(async (fileUrl: string) => {
    try {
      setFileLoading(true);
      console.log("[SignPage] Loading PDF from URL:", fileUrl);
      const pdfRes = await fetch(fileUrl);
      if (!pdfRes.ok) {
        throw new Error(
          `Server returned status ${pdfRes.status}: ${pdfRes.statusText}`,
        );
      }
      const bytes = await pdfRes.arrayBuffer();

      // Check %PDF- header
      const header = new Uint8Array(bytes.slice(0, 5));
      const isPdf =
        header[0] === 0x25 && // %
        header[1] === 0x50 && // P
        header[2] === 0x44 && // D
        header[3] === 0x46 && // F
        header[4] === 0x2d; // -

      if (!isPdf) {
        throw new Error(
          "Downloaded file is not a valid PDF document (missing %PDF- header).",
        );
      }

      setPdfBytes(bytes);
    } catch (e: any) {
      console.error("[SignPage] Error loading PDF:", e);
      setError(
        `Failed to load contract document (${e?.message || e}). Please check the file status.`,
      );
    } finally {
      setFileLoading(false);
    }
  }, []);

  useEffect(() => {
    loginWithSigningToken(token)
      .then(async (loginRes) => {
        console.log("[SignPage] loginWithSigningToken response:", loginRes);
        if (
          loginRes?.specification === "already_signed" ||
          loginRes?.data?.specification === "already_signed" ||
          loginRes?.status === "FORBIDDEN"
        ) {
          throw { data: loginRes?.data || loginRes };
        }
        const csrf =
          loginRes?.data?.access_csrf ||
          loginRes?.access_csrf ||
          loginRes?.csrf_access_token;
        if (csrf && typeof window !== "undefined") {
          localStorage.setItem("access_csrf", csrf);
        }
        const response = await getSigningContract();
        console.log("[SignPage] getSigningContract raw response:", response);
        if (
          response?.specification === "already_signed" ||
          response?.data?.specification === "already_signed" ||
          response?.status === "FORBIDDEN"
        ) {
          throw { data: response?.data || response };
        }
        return { loginRes, response };
      })
      .then(async ({ loginRes, response }) => {
        const rawContract = response?.contract ?? response?.data ?? response;
        const c = {
          ...(loginRes?.signer ?? {}),
          ...(loginRes?.user ?? {}),
          ...(loginRes?.party ?? {}),
          ...rawContract,
        };
        setContract(c);

        if (
          c?.status === "SIGNED" ||
          c?.status === "COMPLETED" ||
          c?.current_signer_status === "SIGNED"
        ) {
          setIsAlreadySigned(true);
        }

        // Find file download URL
        const fileUrl =
          c?.files?.[0]?.download_url ||
          c?.files?.[0]?.url ||
          c?.files?.[0]?.file_url ||
          c?.download_url ||
          c?.file_url ||
          response?.files?.[0]?.download_url ||
          response?.files?.[0]?.url;

        if (!fileUrl) {
          console.warn(
            "[SignPage] No download_url found in GET /contract/get response:",
            c,
          );
          setLoading(false);
          return;
        }

        await loadPdfFromUrl(fileUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error(
          "[SignPage] Error authenticating or fetching contract:",
          err,
        );
        const spec =
          err?.data?.specification ||
          err?.response?.data?.specification ||
          err?.specification ||
          err?.message;
        const status =
          err?.status ||
          err?.data?.status ||
          err?.response?.data?.status;

        if (
          spec === "already_signed" ||
          status === "FORBIDDEN" ||
          (status === 403 && spec === "already_signed")
        ) {
          setError(
            "This contract has already been signed and can no longer be signed.",
          );
          setIsAlreadySigned(true);
          setAlreadySignedDialogOpen(true);
        } else if (spec === "expired") {
          setError(
            "This signing link has expired. A new link has been sent to your email.",
          );
        } else {
          setError("Invalid or expired signing link.");
        }
        setLoading(false);
      });
  }, [token, loadPdfFromUrl]);

  useEffect(() => {
    if (!pdfBytes || !contract) return;
    readPdfFields(pdfBytes.slice(0)).then((all) => {
      const candidateKeys = [
        String(contract.current_signer_key ?? ""),
        String(contract.current_signer_id ?? ""),
        String(contract.current_signer_email ?? ""),
        String(contract.signer_email ?? ""),
        String(contract.email ?? ""),
      ].filter(Boolean);

      const matched = all.find((f) =>
        candidateKeys.some((k) => k.toLowerCase() === f.partyKey.toLowerCase()),
      );

      if (matched) {
        setResolvedPartyKey(matched.partyKey);
      } else if (all.length > 0) {
        setResolvedPartyKey(all[0].partyKey);
      }
    });
  }, [pdfBytes, contract]);

  const partyKey =
    resolvedPartyKey ||
    String(
      contract?.current_signer_key ??
        contract?.current_signer_id ??
        contract?.signer_email ??
        "",
    );

  const handleSign = async () => {
    if (!contract || !pdfBytes) return;

    if (isAlreadySigned) {
      setError(
        "This contract has already been signed and can no longer be signed with this link.",
      );
      setAlreadySignedDialogOpen(true);
      return;
    }

    const signatureData = getSignatureDataUrl();
    if (!signatureData) {
      setError(
        "Please draw your signature in the designated field before submitting.",
      );
      return;
    }

    try {
      setSigning(true);
      setError(null);

      const signedPdfBytes = await embedSignatureIntoPdf(
        pdfBytes.slice(0),
        signatureData,
        partyKey,
        {
          signedAt: new Date(),
          device: navigator.userAgent,
          signerName:
            contract.current_signer_name ?? contract.signer_name ?? "Signer",
        },
        textValues,
      );

      // Local download URL for signed PDF
      const signedBlob = new Blob([signedPdfBytes as BlobPart], {
        type: "application/pdf",
      });
      const localDownloadUrl = URL.createObjectURL(signedBlob);
      setSignedPdfUrl(localDownloadUrl);

      // Calculate SHA-256 hashes
      const documentHash = pdfBytes ? sha256(pdfBytes) : String(contract.id);
      const signedHash = sha256(signedPdfBytes);
      const contractId = contract.id ?? contract.contract_id ?? contract.uuid;

      // File metadata for signed PDF
      const originalFileName =
        contract.files?.[0]?.name || contract.title || "contract";
      const signedFileName = originalFileName.toLowerCase().endsWith(".pdf")
        ? `${originalFileName.slice(0, -4)}_signed.pdf`
        : `${originalFileName}_signed.pdf`;

      const signedFileMeta: SignedFileMeta = {
        name: signedFileName,
        size: signedPdfBytes.byteLength,
        type: "application/pdf",
        hash: signedHash,
      };

      // Convert signed PDF bytes to base64
      let base64Pdf = "";
      try {
        const u8 = new Uint8Array(signedPdfBytes);
        const chunkSize = 8192;
        let binary = "";
        for (let i = 0; i < u8.length; i += chunkSize) {
          const chunk = u8.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
        }
        base64Pdf = window.btoa(binary);
      } catch (b64Err) {
        console.warn("[SignPage] Failed to convert PDF to base64:", b64Err);
      }

      // 1. Upload signed PDF via new /contract/{contract_id}/upload-signed endpoint
      try {
        console.log("[SignPage] Calling uploadSignedContract with metadata & base64...");
        const uploadInfo = await uploadSignedContract(contractId, {
          signed_file: signedFileMeta,
          ...(base64Pdf ? { signed_pdf_base64: base64Pdf } : {}),
        });
        console.log("[SignPage] uploadSignedContract response:", uploadInfo);

        if (uploadInfo?.upload_url) {
          await uploadFileToPresignedUrl(
            uploadInfo.upload_url,
            signedBlob,
            signedHash,
          );
          console.log("[SignPage] S3 PUT upload succeeded via uploadInfo.upload_url");
        }
        if (uploadInfo?.download_url) {
          setSignedPdfUrl(uploadInfo.download_url);
        }
      } catch (uploadErr) {
        console.warn(
          "[SignPage] uploadSignedContract error (will still attempt sign):",
          uploadErr,
        );
      }

      // 2. Submit signature to backend
      const res = await signContract(contractId, {
        signature_svg: {
          data: signatureData,
          svg: signatureData,
        },
        document_hash: documentHash,
        device: navigator.userAgent,
        location: "",
        signed_file: signedFileMeta,
        ...(base64Pdf ? { signed_pdf_base64: base64Pdf } : {}),
      });

      // If signContract returned upload_url, ensure file is uploaded
      if (res?.upload_url) {
        try {
          await uploadFileToPresignedUrl(
            res.upload_url,
            signedBlob,
            signedHash,
          );
          console.log("[SignPage] S3 PUT upload succeeded via res.upload_url");
        } catch (s3Err) {
          console.warn(
            "[SignPage] S3 upload from signContract response failed:",
            s3Err,
          );
        }
      }
      if (res?.download_url) {
        setSignedPdfUrl(res.download_url);
      }

      if (
        res?.specification === "already_signed" ||
        res?.data?.specification === "already_signed" ||
        res?.status === "FORBIDDEN"
      ) {
        throw { data: res?.data || res };
      }

      setSigned(true);
    } catch (err: any) {
      console.error("[SignPage] Error submitting signature:", err);
      const spec =
        err?.data?.specification ||
        err?.response?.data?.specification ||
        err?.specification ||
        err?.message;
      const status =
        err?.status ||
        err?.data?.status ||
        err?.response?.data?.status;

      if (
        spec === "already_signed" ||
        status === "FORBIDDEN" ||
        (status === 403 && spec === "already_signed")
      ) {
        const msg =
          "This contract has already been signed and can no longer be signed with this link.";
        setError(msg);
        setIsAlreadySigned(true);
        setAlreadySignedDialogOpen(true);
        return;
      }

      const msg =
        spec === "missing_required_fields"
          ? "Missing required fields for signing."
          : err?.message || "Failed to submit signature. Please try again.";
      setError(msg);
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !contract) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4, mt: 8 }}>
        <Alert severity={isAlreadySigned ? "warning" : "error"}>{error}</Alert>
      </Box>
    );
  }

  if (signed) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Document Successfully Signed
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Thank you for signing. Your signature has been recorded and the
          document was updated.
        </Typography>
        {signedPdfUrl && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="a"
              href={signedPdfUrl}
              download={`signed_${contract?.title || "contract"}.pdf`}
              startIcon={<DownloadOutlinedIcon />}
            >
              Download Signed PDF
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  const contractFiles: any[] = contract?.files || [];

  return (
    <Box sx={{ maxWidth: 840, mx: "auto", p: { xs: 2, sm: 4 }, mt: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Sign Document
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Please review the document below, fill in any required fields, and
        provide your signature.
      </Typography>

      {contract && (
        <Paper
          variant="outlined"
          sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: "#f8fafc" }}
        >
          <Typography variant="h6" fontWeight={700}>
            {contract.title}
          </Typography>
          {contract.description && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {contract.description}
            </Typography>
          )}
          <Stack direction="row" spacing={3} mt={1.5} flexWrap="wrap">
            {contract.sign_by && (
              <Typography variant="body2">
                Sign by:{" "}
                <strong>
                  {new Date(contract.sign_by).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
              </Typography>
            )}
            {contract.expires_at && (
              <Typography variant="body2">
                Expires at:{" "}
                <strong>
                  {new Date(contract.expires_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
              </Typography>
            )}
          </Stack>
        </Paper>
      )}

      {/* Multi-document handling & attachments list */}
      {contractFiles.length > 1 && (
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "#f8fafc" }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={700}
            mb={1.5}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <AttachFileOutlinedIcon fontSize="small" /> Contract Documents (
            {contractFiles.length})
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            flexWrap="wrap"
          >
            {contractFiles.map((file: any, idx: number) => {
              const isSelected = selectedFileIndex === idx;
              const fileName =
                file.name ||
                file.filename ||
                file.file_name ||
                `Document ${idx + 1}`;
              const downloadUrl = file.download_url || file.url || file.file_url;
              return (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    border: isSelected
                      ? "2px solid #3b82f6"
                      : "1px solid #e2e8f0",
                    borderRadius: 2,
                    bgcolor: isSelected ? "#eff6ff" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    minWidth: 200,
                    cursor: downloadUrl ? "pointer" : "default",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => {
                    if (downloadUrl && idx !== selectedFileIndex) {
                      setSelectedFileIndex(idx);
                      loadPdfFromUrl(downloadUrl);
                    }
                  }}
                >
                  <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      fontWeight={isSelected ? 700 : 500}
                      noWrap
                    >
                      {fileName}
                    </Typography>
                    {file.size_bytes && (
                      <Typography variant="caption" color="text.secondary">
                        {(file.size_bytes / 1024).toFixed(1)} KB
                      </Typography>
                    )}
                  </Box>
                  {downloadUrl && (
                    <IconButton
                      size="small"
                      component="a"
                      href={downloadUrl}
                      download={fileName}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      title="Download file"
                    >
                      <DownloadOutlinedIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Paper>
      )}

      {error && (
        <Alert severity={isAlreadySigned ? "warning" : "error"} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {fileLoading ? (
        <Box sx={{ p: 6, textAlign: "center" }}>
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Loading document…
          </Typography>
        </Box>
      ) : pdfBytes ? (
        <>
          <SigningDocumentViewer
            pdfBytes={pdfBytes}
            partyKey={partyKey}
            textValues={textValues}
            onTextValuesChange={setTextValues}
            onSignatureReady={(ready, getDataUrl) => {
              setHasSignature(ready);
              setGetSignatureDataUrl(() => getDataUrl);
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              mt: 4,
              gap: 2,
            }}
          >
            {error && (
              <Alert
                severity={isAlreadySigned ? "warning" : "error"}
                sx={{ width: "100%", maxWidth: 600 }}
              >
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleSign}
              disabled={isAlreadySigned || !hasSignature || signing}
              color={isAlreadySigned ? "warning" : "primary"}
              startIcon={
                signing ? (
                  <CircularProgress size={16} color="inherit" />
                ) : isAlreadySigned ? (
                  <LockOutlinedIcon />
                ) : undefined
              }
              sx={{ minWidth: 200 }}
            >
              {isAlreadySigned
                ? "Already Signed"
                : signing
                  ? "Submitting signature…"
                  : "Sign and Submit"}
            </Button>
          </Box>
        </>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            borderStyle: "dashed",
            borderColor: "#cbd5e1",
            bgcolor: "#f8fafc",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="text.primary"
            mb={1}
          >
            Document unavailable
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            maxWidth={520}
            mx="auto"
          >
            The server response did not include a download URL for the contract
            file. If you want to test signing immediately, you can upload a PDF
            manually:
          </Typography>
          <Button variant="contained" component="label">
            Upload PDF File (test)
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const bytes = await file.arrayBuffer();
                setPdfBytes(bytes);
              }}
            />
          </Button>
        </Paper>
      )}

      {/* Dialog upozorňující, že smlouva již byla podepsána */}
      <Dialog
        open={alreadySignedDialogOpen}
        onClose={() => setAlreadySignedDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
            pb: 1,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "#fef3c7",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} textAlign="center">
            Contract Already Signed
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            This contract has already been signed using this signing link. It
            cannot be signed again.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, px: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setAlreadySignedDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
