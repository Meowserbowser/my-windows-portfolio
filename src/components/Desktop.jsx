import { useState, useCallback, useEffect } from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import Projects from "./windows/Projects";

// Fallback default icons
import defaultProjectIcon from "../assets/projects.png";

export default function Desktop({ darkMode, setDarkMode }) {
  const [config, setConfig] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [minimized, setMinimized] = useState([]);
  const [zOrder, setZOrder] = useState([]);

  // Fetch live CMS configuration on boot
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.windows) {
          setConfig(data);
        }
      })
      .catch((err) => console.error("Error reading desktop configuration:", err));
  }, []);

  const bringToFront = useCallback((id) => {
    setZOrder((prev) => [...prev.filter((z) => z !== id), id]);
  }, []);

  const openWindow = useCallback(
    (id) => {
      if (!openWindows.includes(id)) {
        setOpenWindows((prev) => [...prev, id]);
        bringToFront(id);
      } else if (minimized.includes(id)) {
        setMinimized((prev) => prev.filter((m) => m !== id));
        bringToFront(id);
      } else {
        bringToFront(id);
      }
    },
    [openWindows, minimized, bringToFront]
  );

  const closeWindow = useCallback((id) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id));
    setMinimized((prev) => prev.filter((m) => m !== id));
    setZOrder((prev) => prev.filter((z) => z !== id));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setMinimized((prev) => [...prev, id]);
  }, []);

  const activeWindowId = [...zOrder].reverse().find((id) => !minimized.includes(id)) || null;

  const handleTaskClick = useCallback(
    (id) => {
      if (activeWindowId === id) {
        minimizeWindow(id);
      } else {
        openWindow(id);
      }
    },
    [activeWindowId, minimizeWindow, openWindow]
  );

  // Dynamic Background Style
  const backgroundStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor:
      config?.background?.type === "color"
        ? config.background.value
        : darkMode
        ? "#1a1a2e"
        : "#008080",
    backgroundImage:
      config?.background?.type === "image" && config?.background?.value
        ? `url(${config.background.value})`
        : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const windowsList = config?.windows || [];

  return (
    <div className="relative overflow-hidden select-none" style={backgroundStyle}>
      {/* Desktop Icons */}
      <div className="absolute top-6 left-6 flex flex-col gap-6 z-0">
        {windowsList.map((win) => {
          const iconSrc = win.icon_url || defaultProjectIcon;
          return (
            <DesktopIcon
              key={win.id}
              label={win.label}
              icon={
                <img
                  src={iconSrc}
                  alt={win.label}
                  className="w-10 h-10 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              }
              darkMode={darkMode}
              onDoubleClick={() => openWindow(win.id)}
            />
          );
        })}
      </div>

      {/* Dynamic Desktop Windows */}
      {windowsList.map((win) => {
        if (!openWindows.includes(win.id)) return null;
        const isMinimized = minimized.includes(win.id);
        const zIndex = zOrder.indexOf(win.id) + 10;
        const iconSrc = win.icon_url || defaultProjectIcon;

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.label}
            icon={
              <img
                src={iconSrc}
                alt={win.label}
                className="w-4 h-4 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            }
            darkMode={darkMode}
            isMinimized={isMinimized}
            zIndex={zIndex}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => bringToFront(win.id)}
          >
            {win.type === "projects" ? (
              <Projects />
            ) : (
              <div
                className="p-4 bg-white text-black h-full overflow-y-auto leading-relaxed select-text"
                style={{ fontFamily: "'Courier New', monospace" }}
                dangerouslySetInnerHTML={{ __html: win.content || "" }}
              />
            )}
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openWindows={openWindows}
        minimized={minimized}
        activeWindow={activeWindowId}
        windowsConfig={windowsList}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}