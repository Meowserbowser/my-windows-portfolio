import { useState, useEffect } from "react";

function bevelStyle(dark, pressed = false, isActive = false) {
  if (dark) {
    if (isActive) {
      return {
        background: "#3a3a6a",
        border: "2px solid",
        borderTopColor: "#5a5a9a",
        borderLeftColor: "#5a5a9a",
        borderRightColor: "#1a1a3a",
        borderBottomColor: "#1a1a3a",
      };
    }
    return {
      background: pressed ? "#1a1a3a" : "#2a2a4a",
      border: "2px solid",
      borderTopColor: pressed ? "#1a1a3a" : "#5a5a9a",
      borderLeftColor: pressed ? "#1a1a3a" : "#5a5a9a",
      borderRightColor: pressed ? "#5a5a9a" : "#1a1a3a",
      borderBottomColor: pressed ? "#5a5a9a" : "#1a1a3a",
    };
  }

  // Light Mode
  if (isActive) {
    return {
      background: "#c0c0c0",
      border: "2px solid",
      borderTopColor: "#ffffff",
      borderLeftColor: "#ffffff",
      borderRightColor: "#808080",
      borderBottomColor: "#808080",
    };
  }

  return {
    background: "#a0a0a0",
    border: "2px solid",
    borderTopColor: "#808080",
    borderLeftColor: "#808080",
    borderRightColor: "#ffffff",
    borderBottomColor: "#ffffff",
  };
}

export default function Taskbar({
  darkMode,
  setDarkMode,
  openWindows = [],
  minimized = [],
  activeWindow = null,
  windowsConfig = [],
  onTaskClick,
}) {
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [currentActiveId, setCurrentActiveId] = useState(
    activeWindow || (openWindows.length > 0 ? openWindows[openWindows.length - 1] : null)
  );

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (activeWindow) {
      setCurrentActiveId(activeWindow);
    } else if (openWindows.length > 0 && !openWindows.includes(currentActiveId)) {
      setCurrentActiveId(openWindows[openWindows.length - 1]);
    }
  }, [activeWindow, openWindows, currentActiveId]);

  const handleTaskTabClick = (id) => {
    setCurrentActiveId(id);
    if (onTaskClick) {
      onTaskClick(id);
    }
  };

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const bar = darkMode ? "#1e1e3e" : "#c0c0c0";
  const text = darkMode ? "#a0a0ff" : "#000000";
  const font = "'Courier New', monospace";

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center px-1 gap-1"
      style={{
        height: "36px",
        background: bar,
        borderTop: darkMode ? "2px solid #4a4a8a" : "2px solid #ffffff",
        boxShadow: darkMode ? "0 -2px 0 #1a1a3a" : "0 -2px 0 #808080",
        zIndex: 9999,
        fontFamily: font,
      }}
    >
      {/* Start Button */}
      <div className="relative">
        <button
          onClick={() => setStartOpen((v) => !v)}
          style={{
            ...bevelStyle(darkMode, startOpen, false),
            fontFamily: font,
            fontWeight: "bold",
            fontSize: "13px",
            color: text,
            padding: "2px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            height: "28px",
            minWidth: "80px",
          }}
        >
          <img
            src="/src/assets/start.png"
            alt="Start"
            style={{ width: "16px", height: "16px", objectFit: "contain" }}
          />
          Start
        </button>

        {/* Start Menu */}
        {startOpen && (
          <div
            className="absolute bottom-10 left-0 w-48 z-50"
            style={{
              ...bevelStyle(darkMode),
              background: darkMode ? "#1e1e3e" : "#c0c0c0",
              fontFamily: font,
            }}
          >
            <div
              style={{
                background: darkMode ? "#2a2a6a" : "#000080",
                color: "#ffffff",
                padding: "8px 10px",
                fontWeight: "bold",
                fontSize: "13px",
                borderBottom: "1px solid #808080",
              }}
            >
              My Portfolio OS
            </div>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
              style={{ color: text, fontSize: "12px" }}
              onClick={() => {
                setDarkMode((d) => !d);
                setStartOpen(false);
              }}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <hr style={{ borderColor: "#808080" }} />
            <button
              className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
              style={{ color: text, fontSize: "12px" }}
              onClick={() => setStartOpen(false)}
            >
              ❌ Close Menu
            </button>
          </div>
        )}
      </div>

      {/* Separator */}
      <div
        style={{
          width: "2px",
          height: "24px",
          background: darkMode ? "#4a4a8a" : "#808080",
          margin: "0 4px",
        }}
      />

      {/* Active Window Buttons */}
      <div className="flex gap-1 flex-1 overflow-x-auto items-center">
        {openWindows.map((id) => {
          const win = windowsConfig.find((w) => w.id === id);
          const isMin = minimized.includes(id);
          const isActive = id === currentActiveId && !isMin;
          const label = win?.label || id;

          return (
            <button
              key={id}
              onClick={() => handleTaskTabClick(id)}
              title={label}
              style={{
                ...bevelStyle(darkMode, !isActive, isActive),
                fontFamily: font,
                fontSize: "12px",
                fontWeight: isActive ? "bold" : "normal",
                color: text,
                padding: "2px 10px",
                cursor: "pointer",
                height: "26px",
                minWidth: "90px",
                maxWidth: "150px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div
        style={{
          ...bevelStyle(darkMode, true),
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "2px 8px",
          height: "28px",
          marginLeft: "auto",
        }}
      >
        <img
          src="/src/assets/clock.png"
          alt="Clock"
          style={{ width: "14px", height: "14px", objectFit: "contain" }}
        />
        <span
          style={{
            color: text,
            fontSize: "12px",
            fontFamily: font,
            minWidth: "76px",
          }}
        >
          {timeStr}
        </span>
      </div>
    </div>
  );
}