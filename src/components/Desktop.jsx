import { useState, useCallback, useEffect } from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import AboutMe from "./windows/AboutMe";
import Projects from "./windows/Projects";
import Teaching from "./windows/Teaching";
import ContactMe from "./windows/ContactMe";

// Default bundled icon assets
import defaultAboutIcon from "../assets/about_me_icon.png";
import defaultProjectsIcon from "../assets/projects.png";
import defaultTeachingIcon from "../assets/teaching.png";
import defaultContactIcon from "../assets/contact_me.png";

export default function Desktop({ darkMode, setDarkMode }) {
  const [config, setConfig] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [minimized, setMinimized] = useState([]);
  const [zOrder, setZOrder] = useState([]);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Error fetching config:", err));
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

  // Core 4 Windows (Permanent)
  const defaultWindows = [
    {
      id: "about",
      label: "About Me",
      iconSrc: defaultAboutIcon,
      component: null, // Rendered via AboutMe lanyard modal
    },
    {
      id: "projects",
      label: "Projects",
      iconSrc: defaultProjectsIcon,
      component: Projects,
      props: {},
    },
    {
      id: "teaching",
      label: "Teaching",
      iconSrc: defaultTeachingIcon,
      component: Teaching,
      props: { data: config?.teaching },
    },
    {
      id: "contact",
      label: "Contact Me",
      iconSrc: defaultContactIcon,
      component: ContactMe,
      props: { data: config?.contact },
    },
  ];

  // Optional custom windows from admin
  const customWindows = (config?.customWindows || []).map((win) => ({
    id: win.id,
    label: win.label,
    iconSrc: win.icon_url || defaultProjectsIcon,
    component: () => (
      <div
        className="p-4 bg-white text-black h-full overflow-y-auto leading-relaxed select-text"
        style={{ fontFamily: "'Courier New', monospace" }}
        dangerouslySetInnerHTML={{ __html: win.content || "" }}
      />
    ),
    props: {},
  }));

  const allWindows = [...defaultWindows, ...customWindows];

  // Dynamic Background Style
  const bgStyle = {
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

  const isAboutOpen = openWindows.includes("about") && !minimized.includes("about");
  const aboutZIndex = zOrder.indexOf("about") !== -1 ? zOrder.indexOf("about") + 10 : 50;

  return (
    <div className="relative overflow-hidden select-none" style={bgStyle}>
      {/* Desktop Icons */}
      <div className="absolute top-6 left-6 flex flex-col gap-6 z-0">
        {allWindows.map((win) => (
          <DesktopIcon
            key={win.id}
            label={win.label}
            icon={
              <img
                src={win.iconSrc}
                alt={win.label}
                className="w-10 h-10 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            }
            darkMode={darkMode}
            onDoubleClick={() => openWindow(win.id)}
          />
        ))}
      </div>

      {/* About Me Lanyard Card */}
      <AboutMe
        isOpen={isAboutOpen}
        zIndex={aboutZIndex}
        data={config?.about}
        onFocus={() => bringToFront("about")}
        onClose={() => closeWindow("about")}
      />

      {/* All standard window frames */}
      {allWindows
        .filter((w) => w.id !== "about")
        .map((win) => {
          if (!openWindows.includes(win.id)) return null;
          const isMinimized = minimized.includes(win.id);
          const zIndex = zOrder.indexOf(win.id) + 10;
          const ContentComponent = win.component;

          return (
            <Window
              key={win.id}
              id={win.id}
              title={win.label}
              icon={
                <img
                  src={win.iconSrc}
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
              <ContentComponent {...win.props} />
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
        windowsConfig={allWindows.map((w) => ({
          id: w.id,
          label: w.label,
          icon: (
            <img
              src={w.iconSrc}
              alt={w.label}
              style={{ width: "16px", height: "16px", objectFit: "contain" }}
            />
          ),
        }))}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}