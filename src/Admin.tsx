import React, { useEffect, useState } from "react";

export default function Admin() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: "",
    image_url: "",
  });

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then(setConfig)
      .catch((err) => console.error("CMS load error:", err));
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
      if (!res.ok) throw new Error("Failed to save configuration");
      alert("Changes saved successfully!");
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const createProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert("Title and description are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (!res.ok) throw new Error("Failed to create project");
      alert("Project added to database!");
      setNewProject({ title: "", description: "", link: "", image_url: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-gray-500">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-xs text-slate-500 mt-1">
              Edit existing component contents, manage projects, and configure background styling.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">
              View Desktop ↗
            </a>
            <button
              onClick={saveConfig}
              disabled={saving || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md text-sm transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : uploading ? "Uploading..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {/* 1. Wallpaper & Background */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-100">1. Desktop Wallpaper</h2>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Type</label>
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
                <option value="image">Image Wallpaper</option>
              </select>
            </div>

            {config.background?.type === "color" ? (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Color</label>
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
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Upload Wallpaper</label>
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
        </div>

        {/* 2. Edit About Me Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-100">2. About Me (Lanyard Card)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Name</label>
              <input
                type="text"
                value={config.about?.name || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    about: { ...config.about, name: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
              <input
                type="text"
                value={config.about?.subtitle || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    about: { ...config.about, subtitle: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email on Card</label>
              <input
                type="text"
                value={config.about?.email || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    about: { ...config.about, email: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Photo</label>
              <div className="flex items-center gap-2">
                {config.about?.photoUrl && (
                  <img
                    src={config.about.photoUrl}
                    alt="Card Preview"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await handleUpload(e.target.files[0]);
                      setConfig({
                        ...config,
                        about: { ...config.about, photoUrl: url },
                      });
                    }
                  }}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Backside Bio</label>
              <textarea
                rows={4}
                value={config.about?.bio || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    about: { ...config.about, bio: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Add Project Record to Postgres */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-100">3. Projects (Add to Directory)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Title</label>
              <input
                type="text"
                placeholder="e.g. 16-Bit Retro Engine"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Live URL / Repo</label>
              <input
                type="text"
                placeholder="https://..."
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    const url = await handleUpload(e.target.files[0]);
                    setNewProject({ ...newProject, image_url: url });
                  }
                }}
                className="text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Project overview..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
          </div>
          <button
            onClick={createProject}
            disabled={saving || uploading}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded text-xs shadow-sm"
          >
            Insert Project into Database
          </button>
        </div>

        {/* 4. Edit Teaching Window */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold">4. Teaching Window Courses</h2>
            <button
              onClick={() => {
                const current = config.teaching || [];
                setConfig({
                  ...config,
                  teaching: [
                    ...current,
                    { title: "New Course", description: "Course description...", level: "Beginner" },
                  ],
                });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded"
            >
              + Add Course
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {(config.teaching || []).map((c: any, idx: number) => (
              <div key={idx} className="p-4 border border-slate-200 rounded bg-slate-50 flex flex-col gap-2">
                <div className="flex justify-between">
                  <input
                    type="text"
                    value={c.title}
                    onChange={(e) => {
                      const updated = [...config.teaching];
                      updated[idx].title = e.target.value;
                      setConfig({ ...config, teaching: updated });
                    }}
                    className="font-bold border p-1 text-sm rounded w-2/3"
                  />
                  <button
                    onClick={() => {
                      const updated = config.teaching.filter((_: any, i: number) => i !== idx);
                      setConfig({ ...config, teaching: updated });
                    }}
                    className="text-red-500 font-bold text-xs"
                  >
                    Delete
                  </button>
                </div>
                <input
                  type="text"
                  value={c.level}
                  onChange={(e) => {
                    const updated = [...config.teaching];
                    updated[idx].level = e.target.value;
                    setConfig({ ...config, teaching: updated });
                  }}
                  className="border p-1 text-xs rounded w-1/3"
                  placeholder="e.g. Beginner, Advanced"
                />
                <textarea
                  value={c.description}
                  onChange={(e) => {
                    const updated = [...config.teaching];
                    updated[idx].description = e.target.value;
                    setConfig({ ...config, teaching: updated });
                  }}
                  className="border p-2 text-xs rounded w-full"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 5. Edit Contact Me Window */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-100">5. Contact Me Window</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Intro Message</label>
              <input
                type="text"
                value={config.contact?.intro || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, intro: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <input
                type="text"
                value={config.contact?.email || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, email: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GitHub URL</label>
              <input
                type="text"
                value={config.contact?.github || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, github: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={config.contact?.linkedin || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, linkedin: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded p-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 6. Optional Custom Windows */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold">6. Additional Custom Windows (Optional)</h2>
              <p className="text-xs text-slate-500">Only use this if you want to add extra windows to your desktop.</p>
            </div>
            <button
              onClick={() => {
                const current = config.customWindows || [];
                setConfig({
                  ...config,
                  customWindows: [
                    ...current,
                    {
                      id: `win_${Date.now()}`,
                      label: "Extra Window",
                      icon_url: "",
                      content: "<p>New custom content...</p>",
                    },
                  ],
                });
              }}
              className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-1.5 rounded"
            >
              + Add Optional Window
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {(config.customWindows || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No extra custom windows added.</p>
            ) : (
              config.customWindows.map((win: any, idx: number) => (
                <div key={win.id} className="p-4 border border-slate-200 rounded bg-slate-50 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={win.label}
                      onChange={(e) => {
                        const updated = [...config.customWindows];
                        updated[idx].label = e.target.value;
                        setConfig({ ...config, customWindows: updated });
                      }}
                      className="font-bold border p-1 text-sm rounded"
                    />
                    <button
                      onClick={() => {
                        const updated = config.customWindows.filter((_: any, i: number) => i !== idx);
                        setConfig({ ...config, customWindows: updated });
                      }}
                      className="text-red-500 font-bold text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  <textarea
                    value={win.content}
                    onChange={(e) => {
                      const updated = [...config.customWindows];
                      updated[idx].content = e.target.value;
                      setConfig({ ...config, customWindows: updated });
                    }}
                    rows={3}
                    className="border p-2 text-xs rounded w-full font-mono"
                  />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}