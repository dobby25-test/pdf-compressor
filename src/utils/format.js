export function formatBytes(b) {
  if (!b) return "0 B";
  const k = 1024;
  const s = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(1)) + " " + s[i];
}

export function pct(orig, comp) {
  if (!orig || !comp) return 0;
  return Math.round(((orig - comp) / orig) * 100);
}

export function getOutputExt(fmt, category, fileName) {
  if (category === "image") {
    const map = { "JPG/JPEG": "jpg", PNG: "png", WebP: "webp" };
    return map[fmt] || "jpg";
  }

  const original = fileName.split(".").pop();
  return original || "bin";
}
