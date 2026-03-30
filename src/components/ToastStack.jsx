export function ToastStack({ toasts, onClose }) {
  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 1000, display: "grid", gap: 8 }}>
      {toasts.map((toast) => {
        const color = {
          info: "#7aa2ff",
          success: "#00E5A0",
          error: "#ff6b6b",
        }[toast.tone] || "#7aa2ff";

        return (
          <div key={toast.id} style={{ background: "#121212", border: `1px solid ${color}66`, color: "#ddd", minWidth: 220, maxWidth: 320, borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: color, flexShrink: 0 }} />
            <div style={{ fontSize: 12, lineHeight: 1.3, flex: 1 }}>{toast.message}</div>
            <button onClick={() => onClose(toast.id)} style={{ background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 14 }}>
              x
            </button>
          </div>
        );
      })}
    </div>
  );
}
