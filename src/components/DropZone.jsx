import { useRef, useState } from "react";
import { ACCENT } from "../constants";

export function DropZone({ onFiles }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current.click()}
      style={{
        border: `2px dashed ${drag ? ACCENT : "#222"}`,
        borderRadius: 20,
        padding: "52px 32px",
        textAlign: "center",
        cursor: "pointer",
        background: drag ? "rgba(0,229,160,0.04)" : "transparent",
        transition: "all .2s",
        marginBottom: 24,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        accept="image/*,.pdf,.docx,.pptx,.xlsx"
        onChange={(e) => onFiles(e.target.files)}
      />

      <div style={{ fontSize: 38, marginBottom: 14 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="6" y="12" width="28" height="20" rx="4" stroke={drag ? ACCENT : "#444"} strokeWidth="1.5" />
          <path d="M20 28V16M14 22l6-6 6 6" stroke={drag ? ACCENT : "#444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ fontSize: 15, color: "#ccc", fontWeight: 500, marginBottom: 6 }}>
        Drop files here or <span style={{ color: ACCENT }}>browse</span>
      </div>

      <div style={{ fontSize: 12, color: "#555" }}>Images | PDF | DOCX | PPTX | XLSX - up to 50 files</div>
    </div>
  );
}
