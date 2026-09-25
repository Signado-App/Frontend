"use client";

import { Rnd } from "react-rnd";
import { useEffect, useMemo, useState } from "react";
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
  TextField,
  Chip,
  Popover,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { FieldType, PlacedField } from "@/types/types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PAGE_WIDTH = 700;

const DEFAULT_SIZE: Record<FieldType, { w: number; h: number }> = {
  signature: { w: 0.28, h: 0.06 },
  text: { w: 0.28, h: 0.038 },
};

const PRESET_LABELS = ["IČO", "Funkce", "Datum", "Poznámka", "Společnost"];

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
  const [textLabel, setTextLabel] = useState("IČO");
  const [activePartyState, setActivePartyState] = useState<string | null>(null);
  const [pageDims, setPageDims] = useState<
    Record<number, { width: number; height: number }>
  >({});

  // Klonování bufferu souboru, aby se předešlo detach chybám
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  useEffect(() => {
    let active = true;
    file.arrayBuffer().then((buf) => {
      if (active) {
        setFileData(new Uint8Array(buf.slice(0)));
      }
    });
    return () => {
      active = false;
    };
  }, [file]);

  const fileSource = useMemo(() => {
    if (fileData) return { data: fileData };
    return file;
  }, [fileData, file]);

  // Editace existujícího pole přes popover
  const [editAnchorEl, setEditAnchorEl] = useState<HTMLElement | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editParty, setEditParty] = useState("");

  const openEditField = (
    e: React.MouseEvent<HTMLElement>,
    field: PlacedField,
  ) => {
    e.stopPropagation();
    setEditingFieldId(field.id);
    setEditLabel(field.label || "");
    setEditParty(field.partyKey);
    setEditAnchorEl(e.currentTarget);
  };

  const closeEditField = () => {
    setEditAnchorEl(null);
    setEditingFieldId(null);
  };

  const saveEditField = () => {
    if (editingFieldId) {
      onChange(
        fields.map((f) =>
          f.id === editingFieldId
            ? {
                ...f,
                label: editLabel.trim() || undefined,
                partyKey: editParty,
              }
            : f,
        ),
      );
    }
    closeEditField();
  };

  const activeParty =
    activePartyState && parties.some((p) => p.key === activePartyState)
      ? activePartyState
      : (parties[0]?.key ?? "");

  const pageFields = fields.filter((f) => f.page === currentPage);
  const pageSize = pageDims[currentPage] ?? { width: 0, height: 0 };

  const addField = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeParty) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const size = DEFAULT_SIZE[activeType];

    const rawXRatio = (e.clientX - rect.left) / rect.width - size.w / 2;
    const rawYRatio = (e.clientY - rect.top) / rect.height - size.h / 2;

    const xRatio = Math.max(0, Math.min(1 - size.w, rawXRatio));
    const yRatio = Math.max(0, Math.min(1 - size.h, rawYRatio));

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
        x: pageSize.width > 0 ? xRatio * pageSize.width : undefined,
        y: pageSize.height > 0 ? yRatio * pageSize.height : undefined,
        width: pageSize.width > 0 ? size.w * pageSize.width : undefined,
        height: pageSize.height > 0 ? size.h * pageSize.height : undefined,
        partyKey: activeParty,
        label: activeType === "text" ? textLabel.trim() || "Text" : undefined,
      },
    ]);
  };

  const removeField = (id: string) =>
    onChange(fields.filter((f) => f.id !== id));

  const partyLabel = (key: string) =>
    parties.find((p) => p.key === key)?.label ?? key;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={1.5}
        flexWrap="wrap"
        useFlexGap
      >
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

        {activeType === "text" && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <TextField
              size="small"
              label="Popisek pole"
              value={textLabel}
              onChange={(e) => setTextLabel(e.target.value)}
              sx={{ width: 140 }}
            />
            <Stack direction="row" spacing={0.5}>
              {PRESET_LABELS.map((preset) => (
                <Chip
                  key={preset}
                  size="small"
                  label={preset}
                  variant={textLabel === preset ? "filled" : "outlined"}
                  color={textLabel === preset ? "secondary" : "default"}
                  onClick={() => setTextLabel(preset)}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={1}>
        Klikni do dokumentu pro umístění pole. Pole lze přetáhnout i zvětšit.
      </Typography>

      <Document
        file={fileSource}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Box
          sx={{
            position: "relative",
            width: PAGE_WIDTH,
            border: "1px solid #e5e7eb",
            cursor: "crosshair",
            bgcolor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
          onClick={addField}
        >
          <Page
            pageNumber={currentPage}
            width={PAGE_WIDTH}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onRenderSuccess={(page) =>
              setPageDims((prev) => ({
                ...prev,
                [currentPage]: { width: page.width, height: page.height },
              }))
            }
          />

          {pageSize.width > 0 &&
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
                            x: d.x,
                            y: d.y,
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
                            width: ref.offsetWidth,
                            height: ref.offsetHeight,
                            x: pos.x,
                            y: pos.y,
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
                  borderRadius: 4,
                  zIndex: 10,
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
                  {f.type === "signature" ? "Podpis" : f.label || "Text"} ·{" "}
                  {partyLabel(f.partyKey)}
                </Typography>

                {f.type === "text" && (
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: 22,
                      transform: "translateY(-50%)",
                      width: 18,
                      height: 18,
                      zIndex: 20,
                      bgcolor: "white",
                      border: "1px solid #e5e7eb",
                      "&:hover": { bgcolor: "#f3e8ff" },
                    }}
                    onClick={(e) => openEditField(e, f)}
                    title="Upravit popisek pole"
                  >
                    <EditOutlinedIcon sx={{ fontSize: 11, color: "#6d28d9" }} />
                  </IconButton>
                )}

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
                  title="Smazat pole"
                >
                  <CloseIcon sx={{ fontSize: 11 }} />
                </IconButton>
              </Rnd>
            ))}
        </Box>
      </Document>

      {/* Popover pro úpravu textového pole */}
      <Popover
        open={Boolean(editAnchorEl)}
        anchorEl={editAnchorEl}
        onClose={closeEditField}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            minWidth: 260,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Upravit textové pole
          </Typography>
          <TextField
            size="small"
            label="Popisek / účel pole"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            placeholder="např. IČO, Funkce, Poznámka"
            autoFocus
          />
          <Select
            size="small"
            value={editParty}
            onChange={(e) => setEditParty(e.target.value)}
          >
            {parties.map((p) => (
              <MenuItem key={p.key} value={p.key}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" onClick={closeEditField}>
              Zrušit
            </Button>
            <Button size="small" variant="contained" onClick={saveEditField}>
              Uložit
            </Button>
          </Stack>
        </Box>
      </Popover>

      {numPages > 1 && (
        <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
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
