import { useEffect, useState } from "react";
import { FORMATS, STORAGE_KEY } from "../constants";

function loadSavedSettings() {
  const defaults = { quality: 75, imageFormat: "JPG/JPEG", tab: "all" };

  if (typeof window === "undefined") return defaults;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    const quality = Number(parsed.quality);

    return {
      quality: Number.isFinite(quality) ? Math.min(100, Math.max(10, quality)) : defaults.quality,
      imageFormat: FORMATS.image.includes(parsed.imageFormat) ? parsed.imageFormat : defaults.imageFormat,
      tab: ["all", "image", "pdf", "document"].includes(parsed.tab) ? parsed.tab : defaults.tab,
    };
  } catch {
    return defaults;
  }
}

export function useCompressorSettings() {
  const initial = loadSavedSettings();
  const [settings, setSettings] = useState({ quality: initial.quality, imageFormat: initial.imageFormat });
  const [tab, setTab] = useState(initial.tab);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, tab }));
  }, [settings, tab]);

  return { settings, setSettings, tab, setTab };
}
