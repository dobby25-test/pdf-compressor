export const ACCENT = "#00E5A0";
export const STORAGE_KEY = "compressor_user_settings_v1";

export const PRESETS = [
  { id: "smallest", label: "Smallest", quality: 35 },
  { id: "balanced", label: "Balanced", quality: 75 },
  { id: "best", label: "Best", quality: 92 },
];

export const FORMATS = {
  image: ["JPG/JPEG", "PNG", "WebP"],
  pdf: ["PDF"],
  document: ["DOCX", "PPTX", "XLSX"],
};

export const FORMAT_MAP = {
  "JPG/JPEG": "image/jpeg",
  PNG: "image/png",
  WebP: "image/webp",
};
