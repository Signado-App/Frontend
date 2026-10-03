"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { PDFViewer } from "@embedpdf/react-pdf-viewer";
import { Box, Button, Typography, Alert, Stack } from "@mui/material";
import { embedSignatureIntoPdf, readPdfFields } from "@/utils/pdfSigning";

export default function PdfTestPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [modifiedUrl, setModifiedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testSign = async () => {
    if (!modifiedUrl) return;
    const bytes = await fetch(modifiedUrl).then((r) => r.arrayBuffer());

    const fields = await readPdfFields(bytes);
    console.log("[Test] nalezená pole:", fields);

    // podpis jako malý černý obdélník, jen pro ověření pozice
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.bezierCurveTo(80, 10, 160, 90, 280, 30);
    ctx.stroke();

    const signed = await embedSignatureIntoPdf(
      bytes,
      canvas.toDataURL(),
      fields[0]?.partyKey ?? "",
      {
        signedAt: new Date(),
        ipAddress: "192.168.1.1",
        device: navigator.userAgent,
        signerName: "Test User",
      },
    );

    const blob = new Blob([signed as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signed.pdf";
    a.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStatus(null);
    setModifiedUrl(null);
    setOriginalUrl(URL.createObjectURL(file));
  };

  const addTestFields = async () => {
    if (!originalUrl) return;

    try {
      setError(null);
      setStatus("Inserting fields...");

      const existingPdfBytes = await fetch(originalUrl).then((r) =>
        r.arrayBuffer(),
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const page = pdfDoc.getPage(0);
      const { height } = page.getSize();

      const nameField = form.createTextField("text.party1.0");
      nameField.setText("");
      nameField.addToPage(page, {
        x: 50,
        y: height - 150,
        width: 200,
        height: 30,
      });

      const signatureField = form.createTextField("signature.party1.1");
      signatureField.setText("Sign Here");
      signatureField.addToPage(page, {
        x: 50,
        y: height - 220,
        width: 200,
        height: 50,
        backgroundColor: rgb(1, 0.88, 0.1),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      signatureField.enableReadOnly();

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes as BlobPart], {
        type: "application/pdf",
      });
      setModifiedUrl(URL.createObjectURL(blob));
      setStatus("Fields inserted. Try entering text into them in the viewer.");
    } catch (e) {
      setError(`Error inserting fields: ${String(e)}`);
      setStatus(null);
    }
  };

  const readFieldPositions = async () => {
    if (!modifiedUrl) return;

    try {
      const bytes = await fetch(modifiedUrl).then((r) => r.arrayBuffer());
      const pdfDoc = await PDFDocument.load(bytes);
      const form = pdfDoc.getForm();

      const info = form.getFields().map((field) => {
        const name = field.getName();
        const widgets = field.acroField.getWidgets();
        const rects = widgets.map((w) => w.getRectangle());
        return { name, rects };
      });

      console.log("[PdfTest] Document fields:", info);
      setStatus(
        `Found ${info.length} field(s). Coordinates logged to console.`,
      );
    } catch (e) {
      setError(`Error reading fields: ${String(e)}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        PDF Form Field Test
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Verifies whether fields created via pdf-lib can be viewed and filled.
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="outlined" component="label">
          Upload PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          onClick={addTestFields}
          disabled={!originalUrl}
        >
          Insert Test Fields
        </Button>

        <Button
          variant="outlined"
          onClick={readFieldPositions}
          disabled={!modifiedUrl}
        >
          Read Field Coordinates
        </Button>
        <Button
          variant="outlined"
          onClick={async () => {
            if (!modifiedUrl) return;
            const bytes = await fetch(modifiedUrl).then((r) => r.arrayBuffer());
            const fields = await readPdfFields(bytes);
            console.log("[Debug] fields immediately after insert:", fields);
          }}
          disabled={!modifiedUrl}
        >
          Debug: Log Fields
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={testSign}
          disabled={!modifiedUrl}
        >
          Test Signature
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {status && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {status}
        </Alert>
      )}

      {modifiedUrl && (
        <Box sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
          <PDFViewer
            config={{ src: modifiedUrl }}
            style={{ height: "700px" }}
          />
        </Box>
      )}

      {!modifiedUrl && originalUrl && (
        <Typography variant="body2" color="text.secondary">
          PDF loaded. Click &quot;Insert Test Fields&quot;.
        </Typography>
      )}
    </Box>
  );
}
