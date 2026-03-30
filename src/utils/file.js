export function getFileCategory(file) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";

  if (
    file.type.includes("word") ||
    file.type.includes("presentation") ||
    file.type.includes("spreadsheet") ||
    file.name.match(/\.(docx|pptx|xlsx)$/i)
  ) {
    return "document";
  }

  return null;
}
