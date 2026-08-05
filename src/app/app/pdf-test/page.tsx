"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PDFViewer } from "@embedpdf/react-pdf-viewer";
import { Box, Button, Typography, Alert, Stack } from "@mui/material";

export default function PdfTestPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [modifiedUrl, setModifiedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setStatus("Vkládám pole...");

      const existingPdfBytes = await fetch(originalUrl).then((r) =>
        r.arrayBuffer(),
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const page = pdfDoc.getPage(0);
      const { height } = page.getSize();

      const nameField = form.createTextField("test.name");
      nameField.setText("");
      nameField.addToPage(page, {
        x: 50,
        y: height - 150,
        width: 200,
        height: 30,
      });

      const signatureField = form.createTextField("test.signature");
      signatureField.setText("");
      signatureField.addToPage(page, {
        x: 50,
        y: height - 220,
        width: 200,
        height: 50,
      });

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes], { type: "application/pdf" });
      setModifiedUrl(URL.createObjectURL(blob));
      setStatus("Pole vložena. Zkus do nich ve vieweru napsat text.");
    } catch (e) {
      setError(`Chyba při vkládání polí: ${String(e)}`);
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

      console.log("[PdfTest] Pole v dokumentu:", info);
      setStatus(`Nalezeno ${info.length} polí. Souřadnice vypsány v konzoli.`);
    } catch (e) {
      setError(`Chyba při čtení polí: ${String(e)}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        PDF form field test
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Ověřuje, jestli pole vytvořená přes pdf-lib jdou vyplnit v EmbedPDF.
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="outlined" component="label">
          Nahrát PDF
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
          Vložit testovací pole
        </Button>

        <Button
          variant="outlined"
          onClick={readFieldPositions}
          disabled={!modifiedUrl}
        >
          Přečíst souřadnice polí
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
          PDF načteno. Klikni na „Vložit testovací pole“.
        </Typography>
      )}
    </Box>
  );
}
