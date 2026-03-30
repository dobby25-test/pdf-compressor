import { ACCENT, FORMATS, PRESETS } from "../constants";

export function SettingsPanel({ settings, setSettings }) {
  return (
    <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 14, padding: 14, marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
        Compression Presets
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {PRESETS.map((p) => {
          const active = settings.quality === p.quality;
          return (
            <button
              key={p.id}
              onClick={() => setSettings((prev) => ({ ...prev, quality: p.quality }))}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: `1px solid ${active ? ACCENT : "#2a2a2a"}`,
                background: active ? "rgba(0,229,160,0.12)" : "transparent",
                color: active ? ACCENT : "#888",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Quality</span>
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{settings.quality}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={settings.quality}
            onChange={(e) => setSettings((prev) => ({ ...prev, quality: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: ACCENT, cursor: "pointer" }}
          />
        </div>

        <div>
          <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
            Image Output
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FORMATS.image.map((format) => {
              const active = settings.imageFormat === format;
              return (
                <button
                  key={format}
                  onClick={() => setSettings((prev) => ({ ...prev, imageFormat: format }))}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: `1px solid ${active ? ACCENT : "#2a2a2a"}`,
                    background: active ? "rgba(0,229,160,0.12)" : "transparent",
                    color: active ? ACCENT : "#777",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {format}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
