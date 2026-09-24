import { useState } from "react";
import Desktop from "./components/Desktop";
import Admin from "./Admin";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // If the browser URL path is "/admin", render the admin control panel
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  return (
    <div className={darkMode ? "dark" : ""} style={{ width: "100vw", height: "100vh" }}>
      <Desktop darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}