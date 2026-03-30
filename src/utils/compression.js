import { FORMAT_MAP } from "../constants";

let pdfLibModulePromise;
let jszipModulePromise;

function loadPdfLib() {
  if (!pdfLibModulePromise) {
    pdfLibModulePromise = import("pdf-lib");
  }
  return pdfLibModulePromise;
}

function loadJsZip() {
  if (!jszipModulePromise) {
    jszipModulePromise = import("jszip");
  }
  return jszipModulePromise;
}

export function preloadCompressionFor(category) {
  if (category === "pdf") {
    loadPdfLib();
  }
  if (category === "zip") {
    loadJsZip();
  }
}

export async function compressImage(file, quality, outputFormat) {
  const mime = FORMAT_MAP[outputFormat] || "image/jpeg";

  // Fast path: avoids base64 conversion and is significantly faster for large images.
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");

      if (mime === "image/jpeg") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(bitmap, 0, 0);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob || file), mime, quality / 100);
      });
    } finally {
      bitmap.close();
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (mime === "image/jpeg") {
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => resolve(blob || file), mime, quality / 100);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function compressPDF(file, quality) {
  const sourceBytes = await file.arrayBuffer();

  try {
    const { PDFDocument } = await loadPdfLib();
    const pdf = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
    const compressed = await pdf.save({ useObjectStreams: quality < 95 });
    return new Blob([compressed], { type: "application/pdf" });
  } catch {
    return new Blob([sourceBytes], { type: "application/pdf" });
  }
}

export async function compressDocument(file) {
  return file;
}

export async function createZipBlob(files) {
  const { default: JSZip } = await loadJsZip();
  const zip = new JSZip();

  files.forEach(({ name, blob }) => {
    zip.file(name, blob);
  });

  return zip.generateAsync({ type: "blob" });
}
