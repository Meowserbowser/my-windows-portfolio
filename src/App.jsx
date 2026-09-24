import { useState } from "react";
import Desktop from "./components/Desktop";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""} style={{ width: "100vw", height: "100vh" }}>
      <Desktop darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}