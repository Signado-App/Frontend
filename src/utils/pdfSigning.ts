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
      "[readPdfFields] Buffer does not contain a valid PDF header (%PDF-).",
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
 * Ořízne prázdné průhledné okraje z HTMLCanvasElement na přesný obdélník tahu podpisu.
 * Zabraňuje zmenšení podpisu a řeší nekompatibilitu trim-canvas s ESM bundlery.
 */
export function trimCanvasToDataUrl(
  canvas: HTMLCanvasElement,
  padding = 4,
): string {
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas.toDataURL("image/png");

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Žádný nakreslený tah (prázdné plátno)
    if (maxX < minX || maxY < minY) {
      return canvas.toDataURL("image/png");
    }

    const cropX = Math.max(0, minX - padding);
    const cropY = Math.max(0, minY - padding);
    const cropW = Math.min(width - cropX, maxX - cropX + 1 + padding);
    const cropH = Math.min(height - cropY, maxY - cropY + 1 + padding);

    const trimmed = document.createElement("canvas");
    trimmed.width = cropW;
    trimmed.height = cropH;
    const trimmedCtx = trimmed.getContext("2d");
    if (!trimmedCtx) return canvas.toDataURL("image/png");

    trimmedCtx.drawImage(
      canvas,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH,
    );

    return trimmed.toDataURL("image/png");
  } catch (err) {
    console.warn("[trimCanvasToDataUrl] Chyba při ořezávání plátna:", err);
    return canvas.toDataURL("image/png");
  }
}

/**
 * Bezpečně ořízne transparentní okraje z libovolného PNG DataURL (asynchronně v prohlížeči).
 */
export async function trimSignatureImage(dataUrl: string): Promise<string> {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !dataUrl.startsWith("data:image/")
  ) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);

        ctx.drawImage(img, 0, 0);
        const trimmed = trimCanvasToDataUrl(canvas);
        resolve(trimmed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
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

  // Ořízneme transparentní okraje, aby podpis dostal maximální prostor a nebyl zmenšený
  const trimmedDataUrl = await trimSignatureImage(signatureDataUrl);
  const pngImage = await pdfDoc.embedPng(dataUrlToBytes(trimmedDataUrl));

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

  // 3. Vykresli podpis a razítko do každého podpisového pole
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

    const isCompact = f.height < 45;
    const fontSize = isCompact ? 4.5 : 5.2;
    const lineSpacing = fontSize + 1.6;

    const stampLines: string[] = [];
    const signerLabel = metadata.signerName
      ? toWinAnsi(metadata.signerName)
      : "Verified signature";

    const dateStr = metadata.signedAt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (isCompact) {
      stampLines.push(
        toWinAnsi(`Digitally signed by: ${signerLabel} (${dateStr})`),
      );
    } else {
      stampLines.push(toWinAnsi(`Digitally signed by: ${signerLabel}`));
      const ip =
        metadata.ipAddress && metadata.ipAddress !== "Získá backend"
          ? ` • IP: ${toWinAnsi(metadata.ipAddress)}`
          : "";
      stampLines.push(toWinAnsi(`Date: ${dateStr}${ip}`));
    }

    const stampHeight = stampLines.length * lineSpacing + 2;
    const sigAreaHeight = Math.max(12, f.height - stampHeight - 4);
    const sigAreaWidth = Math.max(20, f.width - 8);

    const scaled = fitInside(
      pngImage.width,
      pngImage.height,
      sigAreaWidth,
      sigAreaHeight,
    );

    // Kreslení podpisu (zarovnaný nad razítkem ve vyhrazeném prostoru)
    page.drawImage(pngImage, {
      x: f.x + (f.width - scaled.width) / 2,
      y: f.y + stampHeight + (sigAreaHeight - scaled.height) / 2 + 1,
      width: scaled.width,
      height: scaled.height,
    });

    // Decentní oddělovací linka mezi podpisem a razítkem
    page.drawLine({
      start: { x: f.x + 4, y: f.y + stampHeight },
      end: { x: f.x + f.width - 4, y: f.y + stampHeight },
      color: rgb(0.9, 0.92, 0.94),
      thickness: 0.5,
    });

    // Kreslení řádků razítka zespoda nahoru - spodní řádek je vždy na f.y + 2.5 (nikdy nepřeteče)
    stampLines
      .slice()
      .reverse()
      .forEach((line, i) => {
        page.drawText(line, {
          x: f.x + 5,
          y: f.y + 2.5 + i * lineSpacing,
          size: fontSize,
          font,
          color: rgb(0.4, 0.45, 0.5),
        });
      });
  }

  // Pokud v dokumentu nezůstala žádná další podpisová pole jiných stran,
  // můžeme formulář zaflattenovat (uzamknout).
  const hasRemainingSignatures = form.getFields().some((field) => {
    const parsed = parseFieldName(field.getName());
    return parsed?.type === "signature" && parsed.partyKey !== partyKey;
  });

  if (!hasRemainingSignatures) {
    form.flatten();
  }

  return pdfDoc.save();
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
