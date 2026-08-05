"use client";

import { Rnd } from "react-rnd";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { FieldType, PlacedField } from "@/types/types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PAGE_WIDTH = 700;

const DEFAULT_SIZE: Record<FieldType, { w: number; h: number }> = {
  signature: { w: 0.28, h: 0.06 },
  text: { w: 0.28, h: 0.035 },
};

type Party = { key: string; label: string };

type Props = {
  file: File;
  parties: Party[];
  fields: PlacedField[];
  onChange: (fields: PlacedField[]) => void;
};

let fieldCounter = 0;
function generateId() {
  fieldCounter += 1;
  return `field_${Date.now()}_${fieldCounter}`;
}

export default function FieldPlacementEditor({
  file,
  parties,
  fields,
  onChange,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeType, setActiveType] = useState<FieldType>("signature");
  const [activePartyState, setActivePartyState] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0, page: 0 });

  const activeParty =
    activePartyState && parties.some((p) => p.key === activePartyState)
      ? activePartyState
      : (parties[0]?.key ?? "");

  const pageFields = fields.filter((f) => f.page === currentPage);

  const addField = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeParty) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const size = DEFAULT_SIZE[activeType];

    const xRatio = (e.clientX - rect.left) / rect.width - size.w / 2;
    const yRatio = (e.clientY - rect.top) / rect.height - size.h / 2;

    onChange([
      ...fields,
      {
        id: generateId(),
        type: activeType,
        page: currentPage,
        xRatio,
        yRatio,
        widthRatio: size.w,
        heightRatio: size.h,
        partyKey: activeParty,
        label: activeType === "text" ? "Text" : undefined,
      },
    ]);
  };

  const removeField = (id: string) =>
    onChange(fields.filter((f) => f.id !== id));

  const partyLabel = (key: string) =>
    parties.find((p) => p.key === key)?.label ?? key;

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={activeType}
          onChange={(_, v) => v && setActiveType(v)}
        >
          <ToggleButton value="signature">
            <DrawOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
            Podpis
          </ToggleButton>
          <ToggleButton value="text">
            <TextFieldsIcon fontSize="small" sx={{ mr: 0.5 }} />
            Text
          </ToggleButton>
        </ToggleButtonGroup>

        <Select
          size="small"
          value={activeParty}
          onChange={(e) => setActivePartyState(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          {parties.map((p) => (
            <MenuItem key={p.key} value={p.key}>
              {p.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={1}>
        Klikni do dokumentu pro umístění pole. Pole lze přetáhnout i zvětšit.
      </Typography>

      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Box
          sx={{
            position: "relative",
            width: PAGE_WIDTH,
            border: "1px solid #e5e7eb",
            cursor: "crosshair",
          }}
          onClick={addField}
        >
          <Page
            pageNumber={currentPage}
            width={PAGE_WIDTH}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onRenderSuccess={(page) =>
              setPageSize({
                width: page.width,
                height: page.height,
                page: currentPage,
              })
            }
          />

          {pageSize.width > 0 &&
            pageSize.page === currentPage &&
            pageFields.map((f) => (
              <Rnd
                key={f.id}
                bounds="parent"
                dragHandleClassName="field-drag-handle"
                size={{
                  width: f.widthRatio * pageSize.width,
                  height: f.heightRatio * pageSize.height,
                }}
                position={{
                  x: f.xRatio * pageSize.width,
                  y: f.yRatio * pageSize.height,
                }}
                onDragStop={(_, d) => {
                  onChange(
                    fields.map((x) =>
                      x.id === f.id
                        ? {
                            ...x,
                            xRatio: d.x / pageSize.width,
                            yRatio: d.y / pageSize.height,
                          }
                        : x,
                    ),
                  );
                }}
                onResizeStop={(_, __, ref, ___, pos) => {
                  onChange(
                    fields.map((x) =>
                      x.id === f.id
                        ? {
                            ...x,
                            widthRatio: ref.offsetWidth / pageSize.width,
                            heightRatio: ref.offsetHeight / pageSize.height,
                            xRatio: pos.x / pageSize.width,
                            yRatio: pos.y / pageSize.height,
                          }
                        : x,
                    ),
                  );
                }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                style={{
                  border: `2px dashed ${
                    f.type === "signature" ? "#0ea5e9" : "#8b5cf6"
                  }`,
                  background:
                    f.type === "signature"
                      ? "rgba(14,165,233,0.12)"
                      : "rgba(139,92,246,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  className="field-drag-handle"
                  variant="caption"
                  sx={{
                    color: f.type === "signature" ? "#0369a1" : "#6d28d9",
                    fontWeight: 600,
                    cursor: "move",
                    flexGrow: 1,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    px: 0.5,
                    userSelect: "none",
                  }}
                >
                  {f.type === "signature" ? "Podpis" : f.label} ·{" "}
                  {partyLabel(f.partyKey)}
                </Typography>

                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 2,
                    transform: "translateY(-50%)",
                    width: 18,
                    height: 18,
                    zIndex: 20,
                    bgcolor: "white",
                    border: "1px solid #e5e7eb",
                    "&:hover": { bgcolor: "#fee2e2" },
                  }}
                  onClick={() => removeField(f.id)}
                >
                  <CloseIcon sx={{ fontSize: 11 }} />
                </IconButton>
              </Rnd>
            ))}
        </Box>
      </Document>

      {numPages > 1 && (
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <IconButton
            size="small"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <Typography variant="body2">
            Strana {currentPage} z {numPages}
          </Typography>
          <IconButton
            size="small"
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <NavigateNextIcon />
          </IconButton>
        </Stack>
      )}

      {fields.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          mt={1}
          display="block"
        >
          Umístěno {fields.length} polí
        </Typography>
      )}
    </Box>
  );
}
