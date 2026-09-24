import { useState, useCallback } from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import AboutMe from "./windows/AboutMe";
import Projects from "./windows/Projects";
import Teaching from "./windows/Teaching";
import ContactMe from "./windows/ContactMe";

const WINDOWS_CONFIG = [
  { id: "about",    label: "About Me",   icon: <img src="/src/assets/about_me_icon.png" alt="About Me" />, component: null },
  { id: "projects", label: "Projects",   icon: <img src="/src/assets/projects.png" alt="Projects" />, component: Projects },
  { id: "teaching", label: "Teaching",   icon: <img src="/src/assets/teaching.png" alt="Teaching" />, component: Teaching },
  { id: "contact",  label: "Contact Me", icon: <img src="/src/assets/contact_me.png" alt="Contact Me" />, component: ContactMe },
];

export default function Desktop({ darkMode, setDarkMode }) {
  const [openWindows, setOpenWindows] = useState([]);
  const [minimized, setMinimized]     = useState([]);
  const [zOrder, setZOrder]           = useState([]);

  const bringToFront = useCallback((id) => {
    setZOrder((prev) => [...prev.filter((z) => z !== id), id]);
  }, []);

  const openWindow = useCallback((id) => {
    if (!openWindows.includes(id)) {
      setOpenWindows((prev) => [...prev, id]);
      bringToFront(id);
    } else if (minimized.includes(id)) {
      setMinimized((prev) => prev.filter((m) => m !== id));
      bringToFront(id);
    } else {
      bringToFront(id);
    }
  }, [openWindows, minimized, bringToFront]);

  const closeWindow = useCallback((id) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id));
    setMinimized((prev)  => prev.filter((m) => m !== id));
    setZOrder((prev)     => prev.filter((z) => z !== id));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setMinimized((prev) => [...prev, id]);
  }, []);

  // Topmost un-minimized window is considered active
  const activeWindowId = [...zOrder].reverse().find((id) => !minimized.includes(id)) || null;

  // Clicking an active tab on taskbar toggles minimize
  const handleTaskClick = useCallback((id) => {
    if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      openWindow(id);
    }
  }, [activeWindowId, minimizeWindow, openWindow]);

  const bg = darkMode ? "#1a1a2e" : "#008080";
  const isAboutOpen = openWindows.includes("about") && !minimized.includes("about");
  const aboutZIndex = zOrder.indexOf("about") !== -1 ? zOrder.indexOf("about") + 10 : 10;

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{ width: "100vw", height: "100vh", background: bg }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6">
        {WINDOWS_CONFIG.map((win) => (
          <DesktopIcon
            key={win.id}
            label={win.label}
            icon={win.icon}
            darkMode={darkMode}
            onDoubleClick={() => openWindow(win.id)}
          />
        ))}
      </div>

      {/* Render directly inside Desktop.jsx */}
          <AboutMe
            isOpen={isAboutOpen}
            zIndex={aboutZIndex}
            onFocus={() => bringToFront("about")}
            onClose={() => closeWindow("about")}
          />

      {/* ── All other windows ── */}
      {WINDOWS_CONFIG.filter((w) => w.component !== null).map((win) => {
        if (!openWindows.includes(win.id)) return null;
        const isMinimized = minimized.includes(win.id);
        const zIndex = zOrder.indexOf(win.id) + 10;
        const ContentComponent = win.component;

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.label}
            icon={win.icon}
            darkMode={darkMode}
            isMinimized={isMinimized}
            zIndex={zIndex}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => bringToFront(win.id)}
          >
            <ContentComponent />
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
        windowsConfig={WINDOWS_CONFIG}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}