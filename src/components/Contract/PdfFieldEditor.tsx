"use client";

import { useState } from "react";
import { Document, Page } from "react-pdf";
import { Box, Typography } from "@mui/material";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type SignatureField = {
  page: number;
  x: number;
  y: number;
};

type Props = {
  file: File;
  fields: SignatureField[];
  onAddField: (field: SignatureField) => void;
};

export default function PdfFieldEditor({ file, fields, onAddField }: Props) {
  const [numPages, setNumPages] = useState<number>(0);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    pageNum: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddField({ page: pageNum, x, y });
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>
        Click on the document to place signature fields
      </Typography>
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Box
            key={i}
            sx={{ position: "relative", mb: 2, cursor: "crosshair" }}
            onClick={(e) => handleClick(e, i + 1)}
          >
            <Page pageNumber={i + 1} width={600} />
            {fields
              .filter((f) => f.page === i + 1)
              .map((f, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "absolute",
                    left: f.x,
                    top: f.y,
                    width: 150,
                    height: 50,
                    border: "2px dashed #0ea5e9",
                    bgcolor: "rgba(14, 165, 233, 0.1)",
                    pointerEvents: "none",
                  }}
                />
              ))}
          </Box>
        ))}
      </Document>
    </Box>
  );
}
