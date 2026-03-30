import { ACCENT } from "./constants";
import { DropZone } from "./components/DropZone";
import { FileCard } from "./components/FileCard";
import { SettingsPanel } from "./components/SettingsPanel";
import { StatsBar } from "./components/StatsBar";
import { TabBar } from "./components/TabBar";
import { ToastStack } from "./components/ToastStack";
import { useCompressionQueue } from "./hooks/useCompressionQueue";
import { useCompressorSettings } from "./hooks/useCompressorSettings";
import { useToasts } from "./hooks/useToasts";

export default function App() {
  const { settings, setSettings, tab, setTab } = useCompressorSettings();
  const { toasts, addToast, removeToast } = useToasts();

  const {
    items,
    addFiles,
    removeItem,
    onItemAction,
    compressAll,
    downloadOne,
    downloadAll,
    clearAll,
    queueCount,
    activeCount,
    failedCount,
    compressedCount,
  } = useCompressionQueue(settings, addToast);

  const filtered = tab === "all" ? items : items.filter((i) => i.category === tab);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e0e0e0", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 3px; background: #222; border-radius: 2px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${ACCENT}; cursor: pointer; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        button:hover { opacity: .88; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 42 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 100, padding: "6px 16px", marginBottom: 20 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 500, letterSpacing: ".05em" }}>All-in-One File Compressor</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.1, margin: "0 0 14px", fontFamily: "'DM Mono', monospace" }}>
            Compress <span style={{ color: ACCENT }}>anything</span>
            <br />
            in seconds
          </h1>

          <p style={{ fontSize: 15, color: "#666", margin: 0 }}>Images | PDFs | Word, PowerPoint, Excel - free, private, in your browser</p>
        </div>

        <DropZone onFiles={addFiles} />
        <SettingsPanel settings={settings} setSettings={setSettings} />

        {items.length > 0 && (
          <>
            <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 12, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: "#777" }}>
              Queue: {queueCount} waiting | {activeCount} processing | {failedCount} failed
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button onClick={compressAll} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: ACCENT, color: "#000", fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                Compress all
              </button>

              {compressedCount > 0 && (
                <button onClick={downloadAll} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${ACCENT}`, background: "transparent", color: ACCENT, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                  Download all as ZIP ({compressedCount})
                </button>
              )}

              <button onClick={clearAll} style={{ padding: "11px 16px", borderRadius: 12, border: "1px solid #222", background: "transparent", color: "#555", fontSize: 13, fontWeight: 500, fontFamily: "inherit", cursor: "pointer" }}>
                Clear
              </button>
            </div>

            <StatsBar items={items} />
            <TabBar active={tab} onChange={setTab} />

            <div style={{ display: "grid", gap: 12 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px", color: "#444", fontSize: 13 }}>No {tab} files uploaded yet</div>
              ) : (
                filtered.map((item) => (
                  <FileCard key={item.id} item={item} settings={settings} onRemove={removeItem} onAction={onItemAction} onDownload={downloadOne} />
                ))
              )}
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 64, fontSize: 12, color: "#333" }}>All processing happens in your browser - files never leave your device</div>
      </div>

      <ToastStack toasts={toasts} onClose={removeToast} />
    </div>
  );
}
