import React, { useEffect, useState } from "react";

export default function Admin() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then(setConfig)
      .catch((err) => console.error("Failed to load CMS config:", err));
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      const data = await res.json();
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Configuration saved successfully!");
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addWindow = () => {
    setConfig({
      ...config,
      windows: [
        ...config.windows,
        {
          id: `win_${Date.now()}`,
          label: "New Window",
          icon_url: "",
          type: "html",
          content: "<p>Write custom text or HTML here...</p>",
        },
      ],
    });
  };

  if (!config) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-sm text-gray-600">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-xs text-slate-500 mt-1">Manage desktop appearance, windows, and dynamic content.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">
              Preview Site ↗
            </a>
            <button
              onClick={saveConfig}
              disabled={saving || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md text-sm transition-all disabled:opacity-50 shadow-sm"
            >
              {saving ? "Saving..." : uploading ? "Uploading Media..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {/* 1. Background Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-100">1. Desktop Background</h2>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Background Type</label>
              <select
                value={config.background?.type || "color"}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    background: { ...config.background, type: e.target.value },
                  })
                }
                className="border border-slate-300 rounded px-3 py-1.5 text-sm bg-white"
              >
                <option value="color">Solid Color</option>
                <option value="image">Image / Wallpaper</option>
              </select>
            </div>

            {config.background?.type === "color" ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Color Picker</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.background?.value || "#008080"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        background: { ...config.background, value: e.target.value },
                      })
                    }
                    className="w-10 h-9 p-0 border border-slate-300 rounded cursor-pointer"
                  />
                  <span className="font-mono text-xs">{config.background?.value}</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Upload Wallpaper Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await handleUpload(e.target.files[0]);
                      setConfig({
                        ...config,
                        background: { ...config.background, value: url },
                      });
                    }
                  }}
                  className="text-xs"
                />
              </div>
            )}
          </div>

          {config.background?.type === "image" && config.background?.value && (
            <div className="mt-4">
              <span className="block text-xs text-slate-400 mb-1">Active Wallpaper Preview:</span>
              <img
                src={config.background.value}
                alt="Wallpaper Preview"
                className="h-28 rounded border border-slate-200 object-cover shadow-sm"
              />
            </div>
          )}
        </div>

        {/* 2. Desktop Windows & Apps */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold">2. Desktop Windows & Content</h2>
              <p className="text-xs text-slate-500">Add, edit, or remove icons and windows on your desktop.</p>
            </div>
            <button
              onClick={addWindow}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded shadow-sm"
            >
              + Add New Window
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {config.windows?.map((win: any, index: number) => (
              <div
                key={win.id}
                className="p-5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex justify-between items-center gap-4">
                  <input
                    type="text"
                    value={win.label}
                    onChange={(e) => {
                      const newWins = [...config.windows];
                      newWins[index].label = e.target.value;
                      setConfig({ ...config, windows: newWins });
                    }}
                    className="font-bold text-base px-3 py-1.5 border border-slate-300 rounded bg-white w-full max-w-sm"
                    placeholder="Window Name (e.g. Teaching, Contact)"
                  />
                  <button
                    onClick={() => {
                      const newWins = config.windows.filter((_: any, i: number) => i !== index);
                      setConfig({ ...config, windows: newWins });
                    }}
                    className="text-red-500 hover:text-red-700 font-semibold text-xs transition-colors"
                  >
                    Delete Window
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Window Type</label>
                    <select
                      value={win.type}
                      onChange={(e) => {
                        const newWins = [...config.windows];
                        newWins[index].type = e.target.value;
                        setConfig({ ...config, windows: newWins });
                      }}
                      className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white w-full"
                    >
                      <option value="projects">Postgres Projects Grid (Directory view)</option>
                      <option value="html">Custom Content (Text, Bio, Images)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload Icon Asset</label>
                    <div className="flex items-center gap-2">
                      {win.icon_url && (
                        <img
                          src={win.icon_url}
                          alt="Icon"
                          className="w-8 h-8 object-contain p-1 border border-slate-300 bg-white rounded"
                        />
                      )}
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
                        className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {win.type === "html" && (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase">Window Body (HTML / Text):</label>
                    <textarea
                      value={win.content || ""}
                      onChange={(e) => {
                        const newWins = [...config.windows];
                        newWins[index].content = e.target.value;
                        setConfig({ ...config, windows: newWins });
                      }}
                      rows={5}
                      className="w-full border border-slate-300 rounded p-3 font-mono text-xs bg-white leading-relaxed"
                      placeholder="<h3>Welcome</h3><p>Write your bio or experience here...</p>"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                        + Attach image to body
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleUpload(e.target.files[0]);
                              const newWins = [...config.windows];
                              const imgTag = `\n<img src="${url}" alt="Attachment" style="max-width:100%; border: 1px solid #000; margin-top: 10px;" />`;
                              newWins[index].content = (newWins[index].content || "") + imgTag;
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
        </div>

      </div>
    </div>
  );
}