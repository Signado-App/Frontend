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
import { embedSignatureIntoPdf } from "@/utils/pdfSigning";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [getSignatureDataUrl, setGetSignatureDataUrl] = useState<
    () => string | null
  >(() => () => null);
  const [textValues, setTextValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loginWithSigningToken(token)
      .then(() => getSigningContract())
      .then(async (response) => {
        const c = response.contract ?? response.data;
        setContract(c);

        const fileUrl =
          c?.files?.[0]?.download_url || `/api/contracts/${c?.id}/download`;
        if (fileUrl) {
          try {
            const pdfRes = await fetch(fileUrl);
            const bytes = await pdfRes.arrayBuffer();
            setPdfBytes(bytes);
          } catch (e) {
            console.error("Failed to load PDF bytes:", e);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err?.data?.specification === "expired") {
          setError(
            "Tento odkaz na podpis již vypršel. Nový odkaz byl odeslán na váš e-mail.",
          );
        } else {
          setError("Neplatný nebo vypršený odkaz k podpisu.");
        }
        setLoading(false);
      });
  }, [token]);

  const handleSign = async () => {
    if (!contract || !pdfBytes) return;
    const signatureData = getSignatureDataUrl();
    if (!signatureData) {
      setError(
        "Před odesláním prosím nakreslete svůj podpis do vyznačeného pole.",
      );
      return;
    }

    try {
      setSigning(true);
      setError(null);

      const currentPartyKey = String(
        contract.current_signer_key ??
          contract.current_signer_id ??
          contract.signer_email ??
          "",
      );

      const signedPdfBytes = await embedSignatureIntoPdf(
        pdfBytes.slice(0),
        signatureData,
        currentPartyKey,
        {
          signedAt: new Date(),
          ipAddress: "Získá backend",
          device: navigator.userAgent,
          signerName:
            contract.current_signer_name ??
            contract.signer_name ??
            "Podepisující",
        },
        textValues,
      );

      const signedFile = new Blob([signedPdfBytes as BlobPart], {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", signedFile, "signed_contract.pdf");
      formData.append("device", navigator.userAgent);

      await signContract(contract.id, formData);

      setSigned(true);
    } catch (err) {
      console.error(err);
      setError("Podpis se nepodařilo odeslat. Zkuste to prosím znovu.");
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
          Dokument byl úspěšně podepsán
        </Typography>
        <Typography color="text.secondary">
          Děkujeme za podpis smlouvy. Kopie byla uložena a všem stranám bude
          zaslána potvrzovací zpráva.
        </Typography>
      </Box>
    );
  }

  const partyKey = String(
    contract?.current_signer_key ??
      contract?.current_signer_id ??
      contract?.signer_email ??
      "",
  );

  return (
    <Box sx={{ maxWidth: 840, mx: "auto", p: { xs: 2, sm: 4 }, mt: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Podepsat dokument
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Zkontrolujte prosím dokument níže, vyplňte případná požadovaná pole a
        připojte svůj podpis.
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
                Podepsat do:{" "}
                <strong>
                  {new Date(contract.sign_by).toLocaleDateString("cs-CZ")}
                </strong>
              </Typography>
            )}
            {contract.expires_at && (
              <Typography variant="body2">
                Platnost do:{" "}
                <strong>
                  {new Date(contract.expires_at).toLocaleDateString("cs-CZ")}
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
              {signing ? "Odesílám podpis…" : "Podepsat a odeslat"}
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 6, textAlign: "center" }}>
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Načítám PDF dokument k podpisu…
          </Typography>
        </Box>
      )}
    </Box>
  );
}
