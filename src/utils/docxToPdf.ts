import { PDFDocument } from "pdf-lib";

/**
 * Checks if a given file is a Microsoft Word DOCX document.
 */
export function isDocxFile(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

/**
 * Converts a .docx File object into a standard .pdf File object entirely in the browser.
 * Uses `docx-preview` to render document pages into the DOM, snapshots them with `html2canvas`,
 * and packages them into a valid PDF with `pdf-lib`.
 */
export async function convertDocxToPdf(
  file: File,
  onProgress?: (current: number, total: number) => void,
): Promise<File> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("convertDocxToPdf can only be executed in a browser environment.");
  }

  // Dynamic imports to ensure SSR safety
  const docxPreview = await import("docx-preview");
  const html2canvas = (await import("html2canvas")).default;

  const arrayBuffer = await file.arrayBuffer();

  // Create temporary container for docx rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "850px";
  container.style.background = "#ffffff";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "-9999";
  document.body.appendChild(container);

  try {
    // Render DOCX into container
    await docxPreview.renderAsync(arrayBuffer, container, undefined, {
      className: "docx-preview-render",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
    });

    // Small delay to allow any fonts/images inside DOCX to paint
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find all rendered page sections
    let pageElements = Array.from(
      container.querySelectorAll<HTMLElement>(
        "section.docx-preview-render, section.docx, .docx-wrapper > section",
      ),
    );

    // Fallback if no specific section tag is found
    if (pageElements.length === 0) {
      pageElements = Array.from(
        container.querySelectorAll<HTMLElement>(".docx-wrapper, div"),
      ).slice(0, 1);
    }
    if (pageElements.length === 0) {
      pageElements = [container];
    }

    const pdfDoc = await PDFDocument.create();
    const totalPages = pageElements.length;

    for (let i = 0; i < totalPages; i++) {
      onProgress?.(i + 1, totalPages);
      const pageEl = pageElements[i];

      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const pngDataUrl = canvas.toDataURL("image/png");
      const pngImage = await pdfDoc.embedPng(pngDataUrl);

      // Convert dimensions to standard PDF points (72 DPI)
      // canvas.width is doubled due to scale: 2, so widthPt = canvas.width / 2
      const widthPt = canvas.width / 2;
      const heightPt = canvas.height / 2;

      const pdfPage = pdfDoc.addPage([widthPt, heightPt]);
      pdfPage.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: widthPt,
        height: heightPt,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfFilename = file.name.replace(/\.docx$/i, "") + ".pdf";

    return new File([pdfBytes as BlobPart], pdfFilename, {
      type: "application/pdf",
      lastModified: Date.now(),
    });
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}
