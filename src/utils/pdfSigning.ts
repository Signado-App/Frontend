import { PDFDocument, PDFName, rgb, StandardFonts } from "pdf-lib";

export type PdfFieldInfo = {
  name: string;
  type: "signature" | "text";
  partyKey: string;
  page: number; // 1-based
  x: number;
  y: number; // od spodního okraje (PDF systém)
  width: number;
  height: number;
  pageWidth: number;
  pageHeight: number;
  label?: string;
};

export type SignatureMetadata = {
  signedAt: Date;
  ipAddress?: string;
  device?: string;
  signerName?: string;
};

/**
 * Bezpečně rozparsuje název pole ve tvaru "{type}.{partyKey}.{index}".
 * Podporuje partyKey obsahující tečky (např. e-mail "jan.novak@firma.cz").
 */
export function parseFieldName(name: string): {
  type: "signature" | "text";
  partyKey: string;
  index: number;
} | null {
  const parts = name.split(".");
  if (parts.length < 3) return null;
  const rawType = parts[0];
  if (rawType !== "signature" && rawType !== "text") return null;
  const index = parseInt(parts[parts.length - 1], 10);
  const partyKey = parts.slice(1, -1).join(".");
  return { type: rawType, partyKey, index };
}

/**
 * Přečte z PDF pole vytvořená při zakládání kontraktu.
 * Názvy mají tvar "{type}.{partyKey}.{index}".
 */
export async function readPdfFields(
  pdfBytes: ArrayBuffer,
): Promise<PdfFieldInfo[]> {
  if (!pdfBytes || pdfBytes.byteLength < 5) return [];

  // Rychlá kontrola PDF hlavičky '%PDF-'
  const header = new Uint8Array(pdfBytes.slice(0, 5));
  if (
    header[0] !== 0x25 ||
    header[1] !== 0x50 ||
    header[2] !== 0x44 ||
    header[3] !== 0x46 ||
    header[4] !== 0x2d
  ) {
    console.warn(
      "[readPdfFields] Buffer neobsahuje platnou PDF hlavičku (%PDF-).",
    );
    return [];
  }

  try {
    const pdfDoc = await PDFDocument.load(pdfBytes.slice(0));
    const form = pdfDoc.getForm();
    const pages = pdfDoc.getPages();

    const result: PdfFieldInfo[] = [];

    for (const field of form.getFields()) {
      const name = field.getName();
      const parsed = parseFieldName(name);
      if (!parsed) continue;
      const { type: rawType, partyKey } = parsed;

      const tu = field.acroField.dict.get(PDFName.of("TU"));
      let label: string | undefined;
      if (tu && typeof (tu as any).decodeText === "function") {
        try {
          label = (tu as any).decodeText();
        } catch {
          // ignore
        }
      }

      for (const widget of field.acroField.getWidgets()) {
        const rect = widget.getRectangle();

        const pageRef = widget.P();
        const pageIndex = pages.findIndex((p) => p.ref === pageRef);
        if (pageIndex === -1) continue;

        const page = pages[pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        result.push({
          name,
          type: rawType,
          partyKey: partyKey ?? "",
          page: pageIndex + 1,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          pageWidth,
          pageHeight,
          label,
        });
      }
    }

    return result;
  } catch (err) {
    console.error("[readPdfFields] Chyba při načítání PDF dokumentu:", err);
    return [];
  }
}

/**
 * Vloží nakreslený podpis do podpisových polí dané strany
 * a pod něj vykreslí razítko s metadaty.
 *
 * Postup: nejdřív se souřadnice přečtou, pak se podpisová pole
 * této strany odstraní (aby po nich nezůstal viditelný rámeček)
 * a nahradí se přímo vykresleným obrázkem a textem. Zbylá pole
 * (jiných stran nebo textová) se na konci zaflattenují, takže se
 * z nich stanou statické hodnoty a nejde je dál editovat.
 */
export function toWinAnsi(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "");
}

export function renderTextToPng(
  text: string,
  width: number,
  height: number,
): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  ctx.fillStyle = "#0f172a";
  const fontSize = Math.max(9, Math.min(13, height * 0.45));
  ctx.font = `500 ${fontSize}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 6, height / 2);

  return canvas.toDataURL("image/png");
}

/**
 * Vloží nakreslený podpis a vyplněná textová pole dané strany do PDF
 * a pod podpis vykreslí razítko s metadaty.
 */
export async function embedSignatureIntoPdf(
  pdfBytes: ArrayBuffer,
  signatureDataUrl: string,
  partyKey: string,
  metadata: SignatureMetadata,
  textValues?: Record<string, string>,
): Promise<Uint8Array> {
  const allFields = await readPdfFields(pdfBytes.slice(0));
  const mySigFields = allFields.filter(
    (f) => f.type === "signature" && f.partyKey === partyKey,
  );
  const myTextFields = allFields.filter(
    (f) => f.type === "text" && f.partyKey === partyKey,
  );

  const pdfDoc = await PDFDocument.load(pdfBytes.slice(0));
  const form = pdfDoc.getForm();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pngImage = await pdfDoc.embedPng(dataUrlToBytes(signatureDataUrl));

  // 1. Zpracuj textová pole této strany (vlož text a odstraň původní pole)
  for (const f of myTextFields) {
    try {
      const field = form.getField(f.name);
      for (const w of field.acroField.getWidgets()) {
        const pRef = w.P();
        const p = pdfDoc.getPages().find((pg) => pg.ref === pRef);
        if (p) {
          const annots = p.node.Annots();
          const ref = pdfDoc.context.getObjectRef(w.dict);
          if (annots && ref) {
            const idx = annots.asArray().findIndex((r) => r === ref);
            if (idx !== -1) annots.remove(idx);
          }
        }
      }
      form.removeField(field);
    } catch {
      // ignore
    }

    const val = textValues?.[f.name] ?? "";
    const page = pdfDoc.getPage(f.page - 1);

    if (val.trim().length > 0) {
      try {
        const pngDataUrl = renderTextToPng(val, f.width, f.height);
        if (pngDataUrl) {
          const pngImg = await pdfDoc.embedPng(dataUrlToBytes(pngDataUrl));
          page.drawImage(pngImg, {
            x: f.x,
            y: f.y,
            width: f.width,
            height: f.height,
          });
        }
      } catch {
        page.drawRectangle({
          x: f.x,
          y: f.y,
          width: f.width,
          height: f.height,
          color: rgb(1, 1, 1),
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
        });
        page.drawText(toWinAnsi(val), {
          x: f.x + 4,
          y: f.y + f.height / 2 - 4,
          size: Math.max(8, Math.min(11, f.height * 0.4)),
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
    }
  }

  // 2. Odstraň podpisová pole této strany z formuláře i ze stránek
  for (const f of mySigFields) {
    try {
      const field = form.getField(f.name);
      for (const w of field.acroField.getWidgets()) {
        const pRef = w.P();
        const p = pdfDoc.getPages().find((pg) => pg.ref === pRef);
        if (p) {
          const annots = p.node.Annots();
          const ref = pdfDoc.context.getObjectRef(w.dict);
          if (annots && ref) {
            const idx = annots.asArray().findIndex((r) => r === ref);
            if (idx !== -1) {
              annots.remove(idx);
            }
          }
        }
      }
      form.removeField(field);
    } catch {
      // pole už neexistuje, nic se neděje
    }
  }

  const stampLines = buildStampLines(metadata);

  for (const f of mySigFields) {
    const page = pdfDoc.getPage(f.page - 1);

    // Čistý bílý podklad s decentním rámečkem, aby neprosvítal text pod ním
    page.drawRectangle({
      x: f.x,
      y: f.y,
      width: f.width,
      height: f.height,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.85, 0.85, 0.85),
      borderWidth: 0.5,
    });

    const stampHeight = Math.min(f.height * 0.45, stampLines.length * 6.5 + 4);
    const signatureHeight = f.height - stampHeight;

    const scaled = fitInside(
      pngImage.width,
      pngImage.height,
      f.width - 8,
      signatureHeight - 6,
    );

    page.drawImage(pngImage, {
      x: f.x + (f.width - scaled.width) / 2,
      y: f.y + stampHeight + (signatureHeight - scaled.height) / 2,
      width: scaled.width,
      height: scaled.height,
    });

    const fontSize = 5;
    stampLines.forEach((line, i) => {
      page.drawText(line, {
        x: f.x + 4,
        y: f.y + stampHeight - (i + 1) * (fontSize + 1.2),
        size: fontSize,
        font,
        color: rgb(0.25, 0.25, 0.25),
      });
    });
  }

  // Pokud v dokumentu nezůstala žádná další podpisová pole jiných stran,
  // můžeme formulář zaflattenovat (uzamknout).
  // Pokud ještě někdo další čeká na podpis, pole pro něj zachováme.
  const hasRemainingSignatures = form.getFields().some((field) => {
    const parsed = parseFieldName(field.getName());
    return parsed?.type === "signature" && parsed.partyKey !== partyKey;
  });

  if (!hasRemainingSignatures) {
    form.flatten();
  }

  return pdfDoc.save();
}

function buildStampLines(m: SignatureMetadata): string[] {
  const lines: string[] = [];

  lines.push("Signed by:");
  if (m.signerName) lines.push(toWinAnsi(m.signerName).toUpperCase());
  lines.push(`Date: ${m.signedAt.toLocaleString("en-GB")}`);
  if (m.ipAddress) lines.push(`IP: ${m.ipAddress}`);
  if (m.device) lines.push(`Device: ${toWinAnsi(truncate(m.device, 60))}`);

  return lines;
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function fitInside(
  srcW: number,
  srcH: number,
  maxW: number,
  maxH: number,
): { width: number; height: number } {
  const ratio = Math.min(maxW / srcW, maxH / srcH);
  return { width: srcW * ratio, height: srcH * ratio };
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
