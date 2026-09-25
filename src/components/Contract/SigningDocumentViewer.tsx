"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  Paper,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ViewDayOutlinedIcon from "@mui/icons-material/ViewDayOutlined";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import { PdfFieldInfo, readPdfFields } from "@/utils/pdfSigning";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PAGE_WIDTH = 700;

type PageDims = Record<number, { width: number; height: number }>;

type Props = {
  /** Bytes PDF, ze kterých se čtou pole i vykresluje náhled. */
  pdfBytes: ArrayBuffer;
  /** Klíč strany (user_id nebo email), jejíž podpisová pole se mají zpřístupnit k podpisu. */
  partyKey: string;
  /** Zavolá se s podpisem jako PNG data URL pro každé podepsané pole zvlášť; volající je typicky sloučí do jednoho kliknutí na "Podepsat". */
  onSignatureReady: (
    hasSignature: boolean,
    getDataUrl: () => string | null,
  ) => void;
  /** Volitelný externí podpis (např. z hlavního kreslicího plátna nad dokumentem) */
  externalSignature?: string | null;
  /** Vyplněné hodnoty textových polí [fieldName]: text */
  textValues?: Record<string, string>;
  /** Callback při změně hodnot textových polí */
  onTextValuesChange?: (values: Record<string, string>) => void;
};

export default function SigningDocumentViewer({
  pdfBytes,
  partyKey,
  onSignatureReady,
  externalSignature,
  textValues,
  onTextValuesChange,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [fields, setFields] = useState<PdfFieldInfo[]>([]);
  const [pageDims, setPageDims] = useState<PageDims>({});
  const [error, setError] = useState<string | null>(null);
  const sigRef = useRef<SignatureCanvas>(null);

  // Klonujeme buffer pro PDF.js Web Worker, aby nedošlo k jeho "odpojení" (detach)
  const fileSource = useMemo(() => {
    if (!pdfBytes) return null;
    return { data: new Uint8Array(pdfBytes.slice(0)) };
  }, [pdfBytes]);

  // Pole z aktuálního PDF se čtou jednou při načtení, ne při každém renderu.
  useEffect(() => {
    setError(null);
    readPdfFields(pdfBytes.slice(0))
      .then((all) => {
        const mine = all.filter((f) => f.partyKey === partyKey);
        setFields(mine);

        const sigs = mine.filter((f) => f.type === "signature");
        if (sigs.length === 0) {
          setError(
            "V dokumentu nebylo nalezeno žádné podpisové pole pro stranu: " +
              partyKey,
          );
        } else if (sigs[0]?.page) {
          // Automaticky nalistuj stranu s podpisem
          setCurrentPage(sigs[0].page);
        }
      })
      .catch(() => setError("Dokument se nepodařilo přečíst."));
  }, [pdfBytes, partyKey]);

  const handleSignatureChange = () => {
    const canvas = sigRef.current;
    const isEmpty = !canvas || canvas.isEmpty();
    onSignatureReady(!isEmpty, () => {
      if (!canvas || canvas.isEmpty()) return null;
      try {
        return canvas.getTrimmedCanvas().toDataURL("image/png");
      } catch {
        return canvas.toDataURL("image/png");
      }
    });
  };

  const sigFields = fields.filter((f) => f.type === "signature");
  const textFields = fields.filter((f) => f.type === "text");
  const primarySigField = sigFields[0];

  return (
    <Box sx={{ width: "100%", maxWidth: PAGE_WIDTH + 60, mx: "auto" }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Ovládací panel prohlížeče dokumentu */}
      {numPages > 1 && (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 2,
            bgcolor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            borderRadius: 2,
            border: "1px solid #e2e8f0",
          }}
        >
          {viewMode === "single" ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                size="small"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ minWidth: 90, textAlign: "center" }}
              >
                Strana {currentPage} z {numPages}
              </Typography>
              <IconButton
                size="small"
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              >
                <NavigateNextIcon />
              </IconButton>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Zobrazeno všech {numPages} stran pod sebou
            </Typography>
          )}

          {/* Rychlý skok na pole podpisu */}
          {primarySigField && (
            <Stack direction="row" spacing={1} alignItems="center">
              {primarySigField.page === currentPage || viewMode === "all" ? (
                <Chip
                  size="small"
                  color={externalSignature ? "success" : "primary"}
                  variant="outlined"
                  label={
                    externalSignature
                      ? "✓ Podpis vložen na této straně"
                      : `✍️ Podpisové pole na této straně`
                  }
                />
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setCurrentPage(primarySigField.page)}
                >
                  Přejít na podpis (str. {primarySigField.page})
                </Button>
              )}
            </Stack>
          )}

          {textFields.length > 0 && (
            <Chip
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#8b5cf6",
                color: "#6d28d9",
                bgcolor: "rgba(139,92,246,0.06)",
              }}
              label={`📝 ${textFields.length} ${
                textFields.length === 1 ? "textové pole" : "textových polí"
              }`}
            />
          )}

          {/* Přepínač zobrazení: po jedné straně vs. všechny */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Zobrazit po jedné straně (doporučeno)">
              <IconButton
                size="small"
                color={viewMode === "single" ? "primary" : "default"}
                onClick={() => setViewMode("single")}
              >
                <ViewDayOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zobrazit všechny strany pod sebou">
              <IconButton
                size="small"
                color={viewMode === "all" ? "primary" : "default"}
                onClick={() => setViewMode("all")}
              >
                <ViewAgendaOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      )}

      {/* Pracovní plocha s papírovým vzhledem */}
      <Box
        sx={{
          bgcolor: "#f8fafc",
          p: { xs: 1.5, sm: 3 },
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Document
          file={fileSource}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <Typography variant="body2" color="text.secondary" sx={{ py: 6 }}>
              Načítám dokument…
            </Typography>
          }
        >
          <Stack spacing={3} alignItems="center">
            {(viewMode === "single"
              ? [currentPage]
              : Array.from({ length: numPages }, (_, i) => i + 1)
            ).map((pageNum) => (
              <Box
                key={pageNum}
                sx={{
                  position: "relative",
                  width: PAGE_WIDTH,
                  maxWidth: "100%",
                  bgcolor: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <Page
                  pageNumber={pageNum}
                  width={PAGE_WIDTH}
                  onRenderSuccess={(page) =>
                    setPageDims((prev) => ({
                      ...prev,
                      [pageNum]: { width: page.width, height: page.height },
                    }))
                  }
                />

                {fields
                  .filter((f) => f.page === pageNum)
                  .map((f, idx) => {
                    const dims = pageDims[pageNum];
                    if (!dims) return null;

                    // Přepočet z PDF bodů (počátek vlevo dole) do DOM pixelů (počátek vlevo nahoře)
                    const scaleX = dims.width / f.pageWidth;
                    const scaleY = dims.height / f.pageHeight;

                    const left = f.x * scaleX;
                    const top = (f.pageHeight - f.y - f.height) * scaleY;
                    const width = f.width * scaleX;
                    const height = f.height * scaleY;

                    if (f.type === "text") {
                      const val = textValues?.[f.name] ?? "";
                      const placeholder = f.label || "Vyplňte text...";
                      const fontSize = Math.max(
                        10,
                        Math.min(14, height * 0.42),
                      );

                      return (
                        <Box
                          key={f.name}
                          sx={{
                            position: "absolute",
                            left,
                            top,
                            width,
                            height,
                            border: "1.5px solid #8b5cf6",
                            borderRadius: 1,
                            bgcolor: "#ffffff",
                            boxShadow: "0 1px 4px rgba(139, 92, 246, 0.15)",
                            overflow: "hidden",
                            zIndex: 10,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="text"
                            value={val}
                            placeholder={placeholder}
                            onChange={(e) => {
                              if (onTextValuesChange) {
                                onTextValuesChange({
                                  ...(textValues ?? {}),
                                  [f.name]: e.target.value,
                                });
                              }
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "none",
                              outline: "none",
                              padding: "2px 8px",
                              fontSize: `${fontSize}px`,
                              fontFamily: "inherit",
                              color: "#0f172a",
                              backgroundColor: "transparent",
                            }}
                          />
                        </Box>
                      );
                    }

                    const isPrimary = f === primarySigField;

                    return (
                      <Box
                        key={f.name}
                        sx={{
                          position: "absolute",
                          left,
                          top,
                          width,
                          height,
                          border: externalSignature
                            ? "2px solid #10b981"
                            : "2px dashed #0ea5e9",
                          borderRadius: 1,
                          bgcolor: "#ffffff",
                          boxShadow: externalSignature
                            ? "0 2px 8px rgba(16,185,129,0.15)"
                            : "0 1px 3px rgba(0,0,0,0.08)",
                          overflow: "hidden",
                          zIndex: 10,
                          touchAction: "none",
                          userSelect: "none",
                        }}
                      >
                        {externalSignature ? (
                          <Box
                            component="img"
                            src={externalSignature}
                            alt="Podpis"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              p: 0.5,
                              pointerEvents: "none",
                            }}
                          />
                        ) : isPrimary ? (
                          <SignatureCanvas
                            ref={sigRef}
                            penColor="black"
                            onEnd={handleSignatureChange}
                            canvasProps={{
                              width: Math.round(width),
                              height: Math.round(height),
                              style: {
                                display: "block",
                                width: "100%",
                                height: "100%",
                                touchAction: "none",
                                cursor: "crosshair",
                              },
                            }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              color: "#0ea5e9",
                              pointerEvents: "none",
                            }}
                          >
                            {idx > 0 ? "Stejný podpis" : ""}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
              </Box>
            ))}
          </Stack>
        </Document>
      </Box>

      {/* Spodní navigace pro režim po jedné straně */}
      {numPages > 1 && viewMode === "single" && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          mt={2}
        >
          <IconButton
            size="small"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <Typography variant="body2" fontWeight={600}>
            Strana {currentPage} z {numPages}
          </Typography>
          <IconButton
            size="small"
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          >
            <NavigateNextIcon />
          </IconButton>
        </Stack>
      )}

      {primarySigField && !externalSignature && (
        <Stack direction="row" spacing={2} mt={2}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              sigRef.current?.clear();
              onSignatureReady(false, () => null);
            }}
          >
            Vymazat podpis
          </Button>
        </Stack>
      )}
    </Box>
  );
}
