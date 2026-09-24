import React, { useEffect, useState } from "react";

export default function Admin() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/config").then((res) => res.json()).then(setConfig);
  }, []);

  const handleUpload = async (file: File) => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: "POST",
      body: file,
    });
    const data = await res.json();
    return data.url;
  };

  const saveConfig = async () => {
    setSaving(true);
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    alert("Saved successfully!");
    setSaving(false);
  };

  const addWindow = () => {
    setConfig({
      ...config,
      windows: [
        ...config.windows,
        { id: `win_${Date.now()}`, label: "New Window", icon_url: "", type: "html", content: "" }
      ]
    });
  };

  if (!config) return <div className="p-10 font-mono">Loading CMS...</div>;

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen text-black max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ugly But Fast Admin Panel</h1>
        <button onClick={saveConfig} disabled={saving} className="bg-blue-600 text-white px-6 py-2 font-bold hover:bg-blue-700">
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* BACKGROUND SETTINGS */}
      <section className="bg-white p-6 border-2 border-gray-300 mb-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">1. Background Wallpaper</h2>
        <div className="flex gap-4 items-center mb-4">
          <select 
            value={config.background.type} 
            onChange={(e) => setConfig({ ...config, background: { ...config.background, type: e.target.value }})}
            className="border p-2"
          >
            <option value="color">Solid Color</option>
            <option value="image">Image Wallpaper</option>
          </select>

          {config.background.type === "color" ? (
            <input 
              type="color" 
              value={config.background.value} 
              onChange={(e) => setConfig({ ...config, background: { ...config.background, value: e.target.value }})}
            />
          ) : (
            <input 
              type="file" 
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const url = await handleUpload(e.target.files[0]);
                  setConfig({ ...config, background: { ...config.background, value: url }});
                }
              }} 
            />
          )}
        </div>
        {config.background.type === "image" && config.background.value && (
          <img src={config.background.value} alt="bg preview" className="h-32 object-cover border" />
        )}
      </section>

      {/* DESKTOP WINDOWS */}
      <section className="bg-white p-6 border-2 border-gray-300">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">2. Desktop Windows & Content</h2>
          <button onClick={addWindow} className="bg-green-600 text-white px-4 py-1 text-sm font-bold">
            + Add New Window
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {config.windows.map((win: any, index: number) => (
            <div key={win.id} className="border-2 border-gray-200 p-4 bg-gray-50 flex flex-col gap-3">
              
              <div className="flex justify-between">
                <input 
                  type="text" 
                  value={win.label} 
                  onChange={(e) => {
                    const newWins = [...config.windows];
                    newWins[index].label = e.target.value;
                    setConfig({ ...config, windows: newWins });
                  }}
                  className="font-bold text-lg border p-1"
                  placeholder="Window Name (e.g. About Me)"
                />
                <button 
                  onClick={() => {
                    const newWins = config.windows.filter((_, i) => i !== index);
                    setConfig({ ...config, windows: newWins });
                  }}
                  className="text-red-600 font-bold text-sm"
                >
                  Delete Window
                </button>
              </div>

              <div className="flex gap-4 items-center">
                <label className="text-sm font-bold">Window Icon:</label>
                {win.icon_url && <img src={win.icon_url} alt="icon" className="w-8 h-8 object-contain bg-gray-200" />}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await handleUpload(e.target.files[0]);
                      const newWins = [...config.windows];
                      newWins[index].icon_url = url;
                      setConfig({ ...config, windows: newWins });
                    }
                  }} 
                  className="text-sm"
                />
              </div>

              <div className="flex gap-4 items-center">
                <label className="text-sm font-bold">App Type:</label>
                <select 
                  value={win.type}
                  onChange={(e) => {
                    const newWins = [...config.windows];
                    newWins[index].type = e.target.value;
                    setConfig({ ...config, windows: newWins });
                  }}
                  className="border p-1"
                >
                  <option value="html">Custom Content (Text/Images)</option>
                  <option value="projects">Postgres Project Grid</option>
                </select>
              </div>

              {win.type === "html" && (
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-sm font-bold">Content (Accepts HTML):</label>
                  <textarea 
                    value={win.content}
                    onChange={(e) => {
                      const newWins = [...config.windows];
                      newWins[index].content = e.target.value;
                      setConfig({ ...config, windows: newWins });
                    }}
                    className="border p-2 w-full h-32 font-mono text-sm"
                    placeholder="<p>Write your text here...</p>"
                  />
                  <div>
                    <label className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">
                      + Upload Image to paste into content
                      <input 
                        type="file" 
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await handleUpload(e.target.files[0]);
                            const newWins = [...config.windows];
                            newWins[index].content += `\n<img src="${url}" alt="image" style="max-width:100%; margin-top:10px;" />`;
                            setConfig({ ...config, windows: newWins });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}