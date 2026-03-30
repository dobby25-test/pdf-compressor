import { ACCENT } from "../constants";
import { formatBytes, pct } from "../utils/format";

export function FileCard({ item, settings, onRemove, onAction, onDownload }) {
  const saved = item.compressed ? pct(item.file.size, item.compressed.size) : 0;

  let actionText = "Compress";
  if (item.status === "queued") actionText = "Cancel Queue";
  if (item.status === "compressing") actionText = item.cancelRequested ? "Canceling..." : "Cancel";
  if (item.status === "done") actionText = "Recompress";
  if (item.status === "error") actionText = "Retry";
  if (item.status === "canceled") actionText = "Retry";

  const statusColor = {
    idle: "#555",
    queued: "#d3aa42",
    compressing: ACCENT,
    done: ACCENT,
    error: "#ff6b6b",
    canceled: "#888",
  }[item.status || "idle"];

  return (
    <div
      style={{
        background: "#111",
        border: `1px solid ${item.status === "done" ? "rgba(0,229,160,0.3)" : "#1e1e1e"}`,
        borderRadius: 16,
        padding: "18px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {item.category === "image" ? (
            item.preview ? (
              <img src={item.preview} style={{ width: 42, height: 42, objectFit: "cover", borderRadius: 10 }} />
            ) : (
              <span style={{ fontSize: 12 }}>IMG</span>
            )
          ) : item.category === "pdf" ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="2" width="16" height="20" rx="2" stroke="#e74" strokeWidth="1.5" />
              <path d="M8 10h8M8 14h5" stroke="#e74" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="2" width="16" height="20" rx="2" stroke="#4af" strokeWidth="1.5" />
              <path d="M8 8h8M8 12h8M8 16h5" stroke="#4af" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: "#ddd", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.file.name}
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
            {formatBytes(item.file.size)}
            {item.compressed && (
              <span style={{ color: ACCENT, marginLeft: 8 }}>
                -&gt; {formatBytes(item.compressed.size)} <strong>({saved}% saved)</strong>
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, marginTop: 4, color: statusColor, textTransform: "capitalize" }}>
            {item.status}
            {item.category === "image" && (
              <span style={{ color: "#666", marginLeft: 6 }}>
                ({settings.imageFormat} @ {settings.quality}%)
              </span>
            )}
            {item.category !== "image" && <span style={{ color: "#666", marginLeft: 6 }}>({settings.quality}% quality)</span>}
          </div>
          {item.error && <div style={{ marginTop: 4, fontSize: 11, color: "#ff6b6b" }}>{item.error}</div>}
        </div>

        <button
          onClick={() => onRemove(item.id)}
          style={{
            background: "none",
            border: "none",
            color: "#444",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 2,
            flexShrink: 0,
          }}
        >
          x
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ height: 4, background: "#1f1f1f", borderRadius: 999, overflow: "hidden" }}>
          <div
            style={{
              width: `${item.progress || 0}%`,
              height: "100%",
              background: statusColor,
              transition: "width .2s ease",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onAction(item)}
          disabled={item.status === "compressing" && item.cancelRequested}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: item.status === "compressing" || item.status === "queued" ? "#1a1a1a" : ACCENT,
            color: item.status === "compressing" || item.status === "queued" ? "#aaa" : "#000",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          {actionText}
        </button>

        {item.compressed && (
          <button
            onClick={() => onDownload(item)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: `1px solid ${ACCENT}`,
              background: "transparent",
              color: ACCENT,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Download
          </button>
        )}
      </div>

      {item.category === "document" && (
        <div style={{ marginTop: 8, fontSize: 11, color: "#666" }}>Office files are kept unchanged in browser-safe mode.</div>
      )}
    </div>
  );
}
