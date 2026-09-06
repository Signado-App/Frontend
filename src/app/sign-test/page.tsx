"use client";

import { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Alert,
  TextField,
  Divider,
  Paper,
} from "@mui/material";
import dynamic from "next/dynamic";
import { PDFDocument, PDFHexString, PDFName } from "pdf-lib";
import SignatureCanvas from "react-signature-canvas";

const SigningDocumentViewer = dynamic(
  () => import("@/components/Contract/SigningDocumentViewer"),
  { ssr: false },
);
import { embedSignatureIntoPdf } from "@/utils/pdfSigning";

export default function SignFlowTestPage() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("dokument.pdf");
  const [partyKey, setPartyKey] = useState("party1");
  const [hasSignature, setHasSignature] = useState(false);
  const [externalSigDataUrl, setExternalSigDataUrl] = useState<string | null>(
    null,
  );
  const [getSignatureDataUrl, setGetSignatureDataUrl] = useState<
    () => string | null
  >(() => () => null);
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedDone, setSignedDone] = useState(false);
  const externalSigRef = useRef<SignatureCanvas>(null);

  const handleExternalSigChange = () => {
    const canvas = externalSigRef.current;
    if (!canvas || canvas.isEmpty()) {
      setExternalSigDataUrl(null);
      setHasSignature(false);
      setGetSignatureDataUrl(() => () => null);
      return;
    }
    try {
      const trimmed = canvas.getTrimmedCanvas().toDataURL("image/png");
      setExternalSigDataUrl(trimmed);
      setHasSignature(true);
      setGetSignatureDataUrl(() => () => trimmed);
    } catch {
      const full = canvas.toDataURL("image/png");
      setExternalSigDataUrl(full);
      setHasSignature(true);
      setGetSignatureDataUrl(() => () => full);
    }
  };

  const handleClearSignature = () => {
    externalSigRef.current?.clear();
    setExternalSigDataUrl(null);
    setHasSignature(false);
    setGetSignatureDataUrl(() => () => null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSignedDone(false);
    handleClearSignature();
    setTextValues({});
    setFileName(file.name);
    setPdfBytes(await file.arrayBuffer());
  };

  const handleAddTestField = async () => {
    if (!pdfBytes) return;
    try {
      setError(null);
      setSignedDone(false);

      const pdfDoc = await PDFDocument.load(pdfBytes.slice(0));
      const form = pdfDoc.getForm();
      const pages = pdfDoc.getPages();
      if (pages.length === 0) return;

      const page = pages[0];
      const { width, height } = page.getSize();

      const fieldW = Math.min(220, width * 0.4);
      const fieldH = Math.min(60, height * 0.1);

      // 1. Přidej textové pole (např. pro IČO nebo poznámku)
      const textFieldName = `text.${partyKey}.1`;
      try {
        form.removeField(form.getField(textFieldName));
      } catch {
        // pole neexistovalo
      }
      const txtField = form.createTextField(textFieldName);
      txtField.setText("");
      try {
        txtField.acroField.dict.set(
          PDFName.of("TU"),
          PDFHexString.fromText("IČO / Poznámka"),
        );
      } catch {
        // ignore
      }
      txtField.addToPage(page, {
        x: width - fieldW - 40,
        y: 125,
        width: fieldW,
        height: 28,
      });

      // 2. Přidej podpisové pole
      const fieldName = `signature.${partyKey}.0`;
      try {
        form.removeField(form.getField(fieldName));
      } catch {
        // pole zatím neexistovalo
      }

      const sigField = form.createTextField(fieldName);
      sigField.setText("");
      sigField.enableReadOnly();
      sigField.addToPage(page, {
        x: width - fieldW - 40,
        y: 50,
        width: fieldW,
        height: fieldH,
      });

      const saved = await pdfDoc.save();
      // saved.slice().buffer zajistí čistý nový ArrayBuffer
      const freshBuffer = saved.buffer.slice(
        saved.byteOffset,
        saved.byteOffset + saved.byteLength,
      );
      setPdfBytes(freshBuffer as ArrayBuffer);
    } catch (e) {
      setError(`Chyba při vkládání testovacího pole: ${String(e)}`);
    }
  };

  const handleSign = async () => {
    if (!pdfBytes) return;
    const dataUrl = getSignatureDataUrl();
    if (!dataUrl) {
      setError("Nejdřív nakresli podpis do vyznačeného pole.");
      return;
    }

    try {
      setSigning(true);
      setError(null);

      const signed = await embedSignatureIntoPdf(
        pdfBytes.slice(0),
        dataUrl,
        partyKey,
        {
          signedAt: new Date(),
          ipAddress: "127.0.0.1", // TODO: až bude backend, IP zjistí server, ne klient
          device: navigator.userAgent,
          signerName: "Test Signer",
        },
        textValues,
      );

      // TODO: až bude routa od backendu, tady se místo stažení
      // pošle `signed` (Uint8Array) na presigned upload URL, podobně
      // jako u file uploadu při vytváření kontraktu.
      const blob = new Blob([signed as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `signed-${fileName}`;
      a.click();

      setSignedDone(true);
    } catch (e) {
      setError(`Podpis se nepodařilo vložit: ${String(e)}`);
    } finally {
      setSigning(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Test signing flow
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Nahraj PDF s podpisovými poli (vytvořené v Create Contract flow nebo na
        /pdf-test), případně klikni na „Vložit testovací pole“, podepiš a stáhni
        výsledek.
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        useFlexGap
      >
        <Button variant="outlined" component="label">
          Nahrát PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </Button>

        <TextField
          size="small"
          label="Party key"
          value={partyKey}
          onChange={(e) => setPartyKey(e.target.value)}
          helperText="Musí odpovídat partyKey použitému při umístění pole"
        />

        {pdfBytes && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddTestField}
          >
            + Vložit testovací pole pro {partyKey}
          </Button>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {signedDone && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Podepsané PDF bylo staženo.
        </Alert>
      )}

      {pdfBytes ? (
        <>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              mb: 3,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #cbd5e1",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
              1. Nakreslete podpis do plátna
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Podpis nakreslený zde se automaticky ořízne a promítne přímo do
              podpisového pole v dokumentu níže.
            </Typography>

            <Box
              sx={{
                width: "100%",
                maxWidth: 520,
                height: 160,
                bgcolor: "#ffffff",
                border: externalSigDataUrl
                  ? "2px solid #10b981"
                  : "2px dashed #94a3b8",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <SignatureCanvas
                ref={externalSigRef}
                penColor="black"
                onEnd={handleExternalSigChange}
                canvasProps={{
                  width: 520,
                  height: 160,
                  style: {
                    width: "100%",
                    height: "100%",
                    display: "block",
                    touchAction: "none",
                    cursor: "crosshair",
                  },
                }}
              />
            </Box>

            <Stack direction="row" spacing={2} mt={1.5} alignItems="center">
              <Button
                size="small"
                variant="outlined"
                onClick={handleClearSignature}
                disabled={!externalSigDataUrl}
              >
                Vymazat podpis
              </Button>
              {externalSigDataUrl && (
                <Typography
                  variant="caption"
                  color="success.main"
                  fontWeight={600}
                >
                  ✓ Podpis připraven a promítnut do dokumentu
                </Typography>
              )}
            </Stack>
          </Paper>

          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            2. Náhled dokumentu
          </Typography>

          <SigningDocumentViewer
            pdfBytes={pdfBytes}
            partyKey={partyKey}
            externalSignature={externalSigDataUrl}
            textValues={textValues}
            onTextValuesChange={setTextValues}
            onSignatureReady={(ready, getDataUrl) => {
              // Pokud není použit externí podpis, použijeme vnitřní z vieweru
              if (!externalSigDataUrl) {
                setHasSignature(ready);
                setGetSignatureDataUrl(() => getDataUrl);
              }
            }}
          />

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            size="large"
            disabled={!hasSignature || signing}
            onClick={handleSign}
          >
            {signing ? "Podepisuji…" : "Podepsat a stáhnout"}
          </Button>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Nejdřív nahraj PDF a případně klikni na „Vložit testovací pole“.
        </Typography>
      )}
    </Box>
  );
}
