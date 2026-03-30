import { ACCENT } from "../constants";

const tabs = [
  { id: "all", label: "All Files" },
  { id: "image", label: "Images" },
  { id: "pdf", label: "PDF" },
  { id: "document", label: "Documents" },
];

export function TabBar({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "#0d0d0d", padding: "4px", borderRadius: 12, marginBottom: 20 }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
            fontWeight: 500,
            transition: "all .2s",
            background: active === t.id ? ACCENT : "transparent",
            color: active === t.id ? "#000" : "#666",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
