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
  Tabs,
  Tab,
} from "@mui/material";
import dynamic from "next/dynamic";
import { PDFDocument, PDFHexString, PDFName } from "pdf-lib";
import SignatureCanvas from "react-signature-canvas";
import { PlacedField } from "@/types/types";
import { embedFieldsIntoPdf } from "@/utils/pdfFields";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DrawIcon from "@mui/icons-material/Draw";
import DownloadIcon from "@mui/icons-material/Download";

const SigningDocumentViewer = dynamic(
  () => import("@/components/Contract/SigningDocumentViewer"),
  { ssr: false },
);

const FieldPlacementEditor = dynamic(
  () => import("@/components/Contract/FieldPlacementEditor"),
  { ssr: false },
);

import { embedSignatureIntoPdf } from "@/utils/pdfSigning";

export default function SignFlowTestPage() {
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("dokument.pdf");
  const [partyKey, setPartyKey] = useState("party1");
  const [placedFields, setPlacedFields] = useState<PlacedField[]>([]);
  const [activeTab, setActiveTab] = useState<"editor" | "signer">("editor");

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
    setPlacedFields([]);
    setRawFile(file);
    setFileName(file.name);
    const bytes = await file.arrayBuffer();
    setPdfBytes(bytes);
    setActiveTab("editor");
  };

  // Vypálí pole z FieldPlacementEditor do PDF a přejde na záložku podepisování
  const handleApplyEditorFields = async () => {
    if (!rawFile) return;
    try {
      setError(null);
      setSignedDone(false);
      const modifiedFile = await embedFieldsIntoPdf(rawFile, placedFields);
      const buf = await modifiedFile.arrayBuffer();
      setPdfBytes(buf.slice(0));
      setActiveTab("signer");
    } catch (e) {
      setError(`Chyba při ukládání polí do PDF: ${String(e)}`);
    }
  };

  // Stáhne PDF s vypálenými poli
  const handleDownloadPdfWithFields = async () => {
    if (!rawFile) return;
    try {
      const modifiedFile = await embedFieldsIntoPdf(rawFile, placedFields);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(modifiedFile);
      a.download = `with-fields-${rawFile.name}`;
      a.click();
    } catch (e) {
      setError(`Chyba při stahování: ${String(e)}`);
    }
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
      setActiveTab("signer");
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

      {rawFile && pdfBytes ? (
        <>
          <Paper
            variant="outlined"
            sx={{ mb: 3, bgcolor: "#ffffff", borderRadius: 2 }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                value="editor"
                icon={<EditNoteIcon />}
                iconPosition="start"
                label={`1. Umístění polí (${placedFields.length} polí v editoru)`}
              />
              <Tab
                value="signer"
                icon={<DrawIcon />}
                iconPosition="start"
                label="2. Vyplnění a podpis (z pohledu podepisujícího)"
              />
            </Tabs>
          </Paper>

          {activeTab === "editor" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #cbd5e1",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                  1. Umístění polí v dokumentu (stejný editor jako při zakládání
                  smlouvy)
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Přepínejte mezi <strong>Podpis</strong> a{" "}
                  <strong>Text</strong>, vyberte popisek (např. <em>IČO</em>) a
                  klikněte kamkoliv do stránky. Pole můžete přetahovat myší,
                  měnit jejich velikost za rohy a upravovat popisek ikonou
                  tužky.
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApplyEditorFields}
                    disabled={placedFields.length === 0}
                  >
                    Uložit pole do PDF a otestovat podpis ({placedFields.length}{" "}
                    polí) →
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPdfWithFields}
                    disabled={placedFields.length === 0}
                  >
                    Stáhnout PDF s poli
                  </Button>
                </Stack>
              </Paper>

              <FieldPlacementEditor
                file={rawFile}
                parties={[
                  { key: partyKey, label: `${partyKey} (Testovací strana)` },
                ]}
                fields={placedFields}
                onChange={setPlacedFields}
              />

              {placedFields.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleApplyEditorFields}
                  >
                    Přejít k vyplnění a podpisu ({placedFields.length} polí) →
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {activeTab === "signer" && (
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
                  Kreslicí plátno pro podpis
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  Podpis nakreslený zde se automaticky ořízne a promítne přímo
                  do podpisového pole v dokumentu níže.
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
                Náhled dokumentu s poli k vyplnění a podpisu
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
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Nejdřív nahrajte PDF soubor tlačítkem výše.
        </Typography>
      )}
    </Box>
  );
}
