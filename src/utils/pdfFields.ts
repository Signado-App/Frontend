import { PDFDocument, PDFHexString, PDFName } from "pdf-lib";
import { PlacedField } from "@/types/types";

export async function embedFieldsIntoPdf(
  file: File,
  fields: PlacedField[],
): Promise<File> {
  if (fields.length === 0) return file;

  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();

  fields.forEach((f, index) => {
    const page = pdfDoc.getPage(f.page - 1);
    const { width: pw, height: ph } = page.getSize();

    const x = f.xRatio * pw;
    const width = f.widthRatio * pw;
    const height = f.heightRatio * ph;
    const y = ph - f.yRatio * ph - height;

    const name = `${f.type}.${f.partyKey}.${index}`;

    const field = form.createTextField(name);
    field.setText("");
    if (f.label) {
      try {
        field.acroField.dict.set(
          PDFName.of("TU"),
          PDFHexString.fromText(f.label),
        );
      } catch {
        // fallback ignore
      }
    }
    if (f.type === "signature") {
      field.enableReadOnly();
    }
    field.addToPage(page, { x, y, width, height });
  });

  const modifiedBytes = await pdfDoc.save();
  return new File([modifiedBytes as BlobPart], file.name, { type: file.type });
}
