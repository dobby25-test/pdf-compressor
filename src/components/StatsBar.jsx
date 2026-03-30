import { ACCENT } from "../constants";
import { formatBytes } from "../utils/format";

export function StatsBar({ items }) {
  const done = items.filter((i) => i.compressed);
  const savedBytes = done.reduce((s, i) => s + (i.file.size - i.compressed.size), 0);
  const totalOrig = done.reduce((s, i) => s + i.file.size, 0);
  const avgSaved = totalOrig ? Math.round((savedBytes / totalOrig) * 100) : 0;

  if (!done.length) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
      {[
        { label: "Files compressed", value: done.length },
        { label: "Space saved", value: formatBytes(savedBytes) },
        { label: "Avg reduction", value: avgSaved + "%" },
      ].map((s) => (
        <div key={s.label} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
