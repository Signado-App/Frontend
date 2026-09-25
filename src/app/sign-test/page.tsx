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

import { embedSignatureIntoPdf, trimCanvasToDataUrl } from "@/utils/pdfSigning";

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
    const sig = externalSigRef.current;
    if (!sig || sig.isEmpty()) {
      setExternalSigDataUrl(null);
      setHasSignature(false);
      setGetSignatureDataUrl(() => () => null);
      return;
    }
    try {
      const trimmed = trimCanvasToDataUrl(sig.getCanvas());
      setExternalSigDataUrl(trimmed);
      setHasSignature(true);
      setGetSignatureDataUrl(() => () => trimmed);
    } catch {
      const full = sig.toDataURL("image/png");
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

  // Burn fields from FieldPlacementEditor into PDF and switch to signing tab
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
      setError(`Error saving fields to PDF: ${String(e)}`);
    }
  };

  // Download PDF with placed fields
  const handleDownloadPdfWithFields = async () => {
    if (!rawFile) return;
    try {
      const modifiedFile = await embedFieldsIntoPdf(rawFile, placedFields);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(modifiedFile);
      a.download = `with-fields-${rawFile.name}`;
      a.click();
    } catch (e) {
      setError(`Error downloading: ${String(e)}`);
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

      // 1. Add text field (e.g. Note / Company)
      const textFieldName = `text.${partyKey}.1`;
      try {
        form.removeField(form.getField(textFieldName));
      } catch {
        // ignore
      }
      const txtField = form.createTextField(textFieldName);
      txtField.setText("");
      try {
        txtField.acroField.dict.set(
          PDFName.of("TU"),
          PDFHexString.fromText("Note / Company"),
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

      // 2. Add signature field
      const fieldName = `signature.${partyKey}.0`;
      try {
        form.removeField(form.getField(fieldName));
      } catch {
        // ignore
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
      const freshBuffer = saved.buffer.slice(
        saved.byteOffset,
        saved.byteOffset + saved.byteLength,
      );
      setPdfBytes(freshBuffer as ArrayBuffer);
      setActiveTab("signer");
    } catch (e) {
      setError(`Error inserting test field: ${String(e)}`);
    }
  };

  const handleSign = async () => {
    if (!pdfBytes) return;
    const dataUrl = getSignatureDataUrl();
    if (!dataUrl) {
      setError("Please draw your signature in the designated field first.");
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
          ipAddress: "127.0.0.1",
          device: navigator.userAgent,
          signerName: "Test Signer",
        },
        textValues,
      );

      const blob = new Blob([signed as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `signed-${fileName}`;
      a.click();

      setSignedDone(true);
    } catch (e) {
      setError(`Failed to embed signature: ${String(e)}`);
    } finally {
      setSigning(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Signature & Field Placement Test
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Upload a PDF with signature fields (created in Create Contract flow or
        in PDF test), or click "Add test fields", sign, and download the
        resulting document.
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
          Upload PDF
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
          helperText="Must match the partyKey used when placing fields"
        />

        {pdfBytes && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddTestField}
          >
            + Add test fields for {partyKey}
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
          Signed PDF downloaded successfully.
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
                label={`1. Field Placement (${placedFields.length} in editor)`}
              />
              <Tab
                value="signer"
                icon={<DrawIcon />}
                iconPosition="start"
                label="2. Fill & Sign (Signer View)"
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
                  1. Place fields in document (same editor as Create Contract)
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Switch between <strong>Signature</strong> and{" "}
                  <strong>Text</strong>, select a label (e.g. <em>Note</em>) and
                  click anywhere on the page. You can drag and resize placed
                  fields.
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApplyEditorFields}
                    disabled={placedFields.length === 0}
                  >
                    Save fields to PDF & test signing ({placedFields.length}{" "}
                    fields) →
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPdfWithFields}
                    disabled={placedFields.length === 0}
                  >
                    Download PDF with fields
                  </Button>
                </Stack>
              </Paper>

              <FieldPlacementEditor
                file={rawFile}
                parties={[{ key: partyKey, label: `${partyKey} (Test Party)` }]}
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
                    Proceed to Fill & Sign ({placedFields.length} fields) →
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
                  Signature Canvas
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  Signature drawn here is automatically trimmed and placed into
                  the designated signature field in the document below.
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
                    penColor="#0f172a"
                    minWidth={1.2}
                    maxWidth={3.0}
                    velocityFilterWeight={0.7}
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
                    Clear signature
                  </Button>
                  {externalSigDataUrl && (
                    <Typography
                      variant="caption"
                      color="success.main"
                      fontWeight={600}
                    >
                      ✓ Signature ready and reflected in document
                    </Typography>
                  )}
                </Stack>
              </Paper>

              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                Document Preview with Fields to Fill and Sign
              </Typography>

              <SigningDocumentViewer
                pdfBytes={pdfBytes}
                partyKey={partyKey}
                externalSignature={externalSigDataUrl}
                textValues={textValues}
                onTextValuesChange={setTextValues}
                onSignatureReady={(ready, getDataUrl) => {
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
                {signing ? "Signing…" : "Sign and Download"}
              </Button>
            </>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Please upload a PDF file using the button above first.
        </Typography>
      )}
    </Box>
  );
}
