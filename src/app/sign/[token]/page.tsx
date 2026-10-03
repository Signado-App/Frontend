"use client";

import { use, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import dynamic from "next/dynamic";
import { loginWithSigningToken } from "@/services/auth";
import { getSigningContract, signContract } from "@/services/signing";
import apiClient from "@/services/apiClient";
import { embedSignatureIntoPdf, readPdfFields } from "@/utils/pdfSigning";
import { sha256 } from "js-sha256";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

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
  const [resolvedPartyKey, setResolvedPartyKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [getSignatureDataUrl, setGetSignatureDataUrl] = useState<
    () => string | null
  >(() => () => null);
  const [textValues, setTextValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loginWithSigningToken(token)
      .then(async (loginRes) => {
        console.log("[SignPage] loginWithSigningToken response:", loginRes);
        const csrf =
          loginRes?.data?.access_csrf ||
          loginRes?.access_csrf ||
          loginRes?.csrf_access_token;
        if (csrf && typeof window !== "undefined") {
          localStorage.setItem("access_csrf", csrf);
        }
        const response = await getSigningContract();
        console.log("[SignPage] getSigningContract raw response:", response);
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

        // Hledání URL PDF souboru ve všech možných strukturách odpovědi
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
            "[SignPage] Backend v GET /contract/get nevrátil pole files s download_url:",
            c,
          );
          setLoading(false);
          return;
        }

        try {
          console.log("[SignPage] Stahuji PDF z URL:", fileUrl);
          const pdfRes = await fetch(fileUrl);
          if (!pdfRes.ok) {
            throw new Error(
              `Server vrátil chybu ${pdfRes.status}: ${pdfRes.statusText}`,
            );
          }
          const bytes = await pdfRes.arrayBuffer();

          // Kontrola, zda stažený obsah začíná PDF hlavičkou '%PDF-'
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
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(
          "[SignPage] Error authenticating or fetching contract:",
          err,
        );
        if (err?.data?.specification === "expired") {
          setError(
            "This signing link has expired. A new link has been sent to your email.",
          );
        } else {
          setError("Invalid or expired signing link.");
        }
        setLoading(false);
      });
  }, [token]);

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

      // Připravíme lokální URL pro stažení podepsaného PDF
      const signedBlob = new Blob([signedPdfBytes as BlobPart], {
        type: "application/pdf",
      });
      const localDownloadUrl = URL.createObjectURL(signedBlob);
      setSignedPdfUrl(localDownloadUrl);

      // Spočítáme SHA-256 hash dokumentu (nebo použijeme ID smlouvy)
      const documentHash = pdfBytes ? sha256(pdfBytes) : String(contract.id);

      // Odešleme JSON přesně podle požadavků backendu
      await signContract(contract.id, {
        signature_svg: {
          data: signatureData,
          svg: signatureData,
        },
        document_hash: documentHash,
        device: navigator.userAgent,
        location: "",
      });

      setSigned(true);
    } catch (err: any) {
      console.error("[SignPage] Error submitting signature:", err);
      const msg =
        err?.data?.specification === "already_signed"
          ? "This contract has already been signed."
          : err?.data?.specification === "missing_required_fields"
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
        <Alert severity="error">{error}</Alert>
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {pdfBytes ? (
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

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSign}
              disabled={!hasSignature || signing}
              startIcon={
                signing ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
              sx={{ minWidth: 200 }}
            >
              {signing ? "Submitting signature…" : "Sign and Submit"}
            </Button>
          </Box>
        </>
      ) : loading ? (
        <Box sx={{ p: 6, textAlign: "center" }}>
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Loading PDF document…
          </Typography>
        </Box>
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
    </Box>
  );
}
