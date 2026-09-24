import { useState, useRef } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

function bevelStyle(dark) {
  return {
    background: dark ? "#1e1e3e" : "#c0c0c0",
    border: "2px solid",
    borderTopColor: dark ? "#5a5a9a" : "#ffffff",
    borderLeftColor: dark ? "#5a5a9a" : "#ffffff",
    borderRightColor: dark ? "#1a1a3a" : "#808080",
    borderBottomColor: dark ? "#1a1a3a" : "#808080",
  };
}

export default function Window({
  id, title, icon, darkMode, isMinimized, zIndex,
  onClose, onMinimize, onFocus, children,
}) {
  const [maximized, setMaximized] = useState(false);
  const nodeRef = useRef(null);
  const font = "'Courier New', monospace";
  const titleBg = darkMode ? "#000060" : "#000080";

  if (isMinimized) return null;

  const winStyle = {
    ...bevelStyle(darkMode),
    position: "absolute",
    zIndex,
    fontFamily: font,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...(maximized ? {
      top: 0, left: 0,
      width: "100vw",
      height: "calc(100vh - 36px)",
      transform: "none",
    } : {}),
  };

  const titleBar = (
    <div
      className="flex items-center justify-between px-1 cursor-move"
      style={{
        background: titleBg,
        height: "24px",
        flexShrink: 0,
        userSelect: "none",
      }}
      onMouseDown={onFocus}
    >
      <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
        {icon} {title}
      </span>
      <div className="flex gap-1">
        {["_", "□", "✕"].map((btn, i) => (
          <button
            key={i}
            onClick={i === 0 ? onMinimize : i === 1 ? () => setMaximized((m) => !m) : onClose}
            style={{
              width: "18px", height: "18px",
              background: "#c0c0c0",
              border: "2px solid",
              borderTopColor: "#ffffff",
              borderLeftColor: "#ffffff",
              borderRightColor: "#808080",
              borderBottomColor: "#808080",
              fontSize: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#000000",
              lineHeight: 1,
              fontFamily: font,
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );

  // Menu bar
  const menuBar = (
    <div
      style={{
        background: darkMode ? "#2a2a4a" : "#c0c0c0",
        borderBottom: "1px solid",
        borderColor: darkMode ? "#4a4a8a" : "#808080",
        display: "flex",
        gap: "8px",
        padding: "2px 4px",
        fontSize: "12px",
        color: darkMode ? "#a0a0ff" : "#000000",
        flexShrink: 0,
      }}
    >
      {["File", "Edit", "View", "Help"].map((m) => (
        <span key={m} style={{ cursor: "default", padding: "1px 4px" }} className="hover:bg-blue-800 hover:text-white">{m}</span>
      ))}
    </div>
  );

  const content = (
    <div style={{ ...winStyle, ...(maximized ? winStyle : {}) }}>
      {titleBar}
      {menuBar}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: darkMode ? "#0f0f2a" : "#ffffff",
          color: darkMode ? "#e0e0ff" : "#000000",
          padding: "12px",
          fontSize: "13px",
          fontFamily: font,
        }}
      >
        {children}
      </div>
      {/* Status bar */}
      <div
        style={{
          background: darkMode ? "#1e1e3e" : "#c0c0c0",
          borderTop: "1px solid",
          borderColor: darkMode ? "#4a4a8a" : "#808080",
          padding: "2px 6px",
          fontSize: "11px",
          color: darkMode ? "#8080cc" : "#444444",
          flexShrink: 0,
        }}
      >
        Ready
      </div>
    </div>
  );

  if (maximized) {
    return <div ref={nodeRef} style={{ position: "absolute", top: 0, left: 0, zIndex, width: "100vw", height: "calc(100vh - 36px)" }}>{content}</div>;
  }

  return (
    <Draggable nodeRef={nodeRef} handle=".cursor-move" defaultPosition={{ x: 80 + Math.random() * 120, y: 40 + Math.random() * 80 }} onMouseDown={onFocus}>
      <div ref={nodeRef} style={{ position: "absolute", zIndex }}>
        <ResizableBox
          width={520}
          height={380}
          minConstraints={[260, 200]}
          maxConstraints={[900, 700]}
          resizeHandles={["se"]}
        >
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", ...bevelStyle(darkMode) }}>
            {titleBar}
            {menuBar}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                background: darkMode ? "#0f0f2a" : "#ffffff",
                color: darkMode ? "#e0e0ff" : "#000000",
                padding: "12px",
                fontSize: "13px",
                fontFamily: font,
              }}
            >
              {children}
            </div>
            <div
              style={{
                background: darkMode ? "#1e1e3e" : "#c0c0c0",
                borderTop: "1px solid",
                borderColor: darkMode ? "#4a4a8a" : "#808080",
                padding: "2px 6px",
                fontSize: "11px",
                color: darkMode ? "#8080cc" : "#444444",
                flexShrink: 0,
              }}
            >
              Ready
            </div>
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
}