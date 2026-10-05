import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  image_url?: string;
  created_at?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load project records");
        return res.json();
      })
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="w-full h-full p-6 overflow-y-auto select-text bg-white text-black"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Directory Header */}
      <div className="flex justify-between items-baseline border-b-2 border-black pb-2 mb-6">
        <h2 className="text-xl font-black tracking-wider">DIRECTORY: C:\PROJECTS</h2>
        <span className="text-xs text-neutral-500">
          [{projects.length} file(s)]
        </span>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-8 text-center text-sm text-neutral-500 border-2 border-dashed border-neutral-300">
          Scanning database records...
        </div>
      )}

      {error && (
        <div className="p-4 text-xs text-red-600 bg-red-50 border border-red-300 mb-4">
          Error: {error}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="p-12 text-center text-neutral-500 border-2 border-dashed border-neutral-300">
          Directory empty. No project records present in database.
        </div>
      )}

      {/* Responsive Grid that adapts smoothly when resized or maximized */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: "#c0c0c0",
              borderTop: "2px solid #ffffff",
              borderLeft: "2px solid #ffffff",
              borderRight: "2px solid #404040",
              borderBottom: "2px solid #404040",
              boxShadow: "2px 2px 0px #000000",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Screenshot Container - Fully visible with no cropping */}
            {project.image_url ? (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  borderTop: "2px solid #808080",
                  borderLeft: "2px solid #808080",
                  borderRight: "2px solid #ffffff",
                  borderBottom: "2px solid #ffffff",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "360px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  height: "120px",
                  backgroundColor: "#dfdfdf",
                  borderTop: "2px solid #808080",
                  borderLeft: "2px solid #808080",
                  borderRight: "2px solid #ffffff",
                  borderBottom: "2px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontSize: "12px",
                }}
              >
                [NO PREVIEW AVAILABLE]
              </div>
            )}

            {/* Project Title */}
            <h3
              style={{
                color: "#000080",
                fontSize: "15px",
                fontWeight: "900",
                lineHeight: "1.3",
                margin: 0,
              }}
            >
              {project.title}
            </h3>

            {/* Project Description */}
            <p
              style={{
                fontSize: "12px",
                lineHeight: "1.6",
                color: "#222222",
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {project.description}
            </p>

            {/* Run / Visit Link Button */}
            {project.link && (
              <div style={{ marginTop: "4px" }}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "3px 12px",
                    backgroundColor: "#c0c0c0",
                    color: "#000000",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textDecoration: "none",
                    borderTop: "2px solid #ffffff",
                    borderLeft: "2px solid #ffffff",
                    borderRight: "2px solid #404040",
                    borderBottom: "2px solid #404040",
                    boxShadow: "1px 1px 0px #000000",
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.borderTop = "2px solid #404040";
                    e.currentTarget.style.borderLeft = "2px solid #404040";
                    e.currentTarget.style.borderRight = "2px solid #ffffff";
                    e.currentTarget.style.borderBottom = "2px solid #ffffff";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.borderTop = "2px solid #ffffff";
                    e.currentTarget.style.borderLeft = "2px solid #ffffff";
                    e.currentTarget.style.borderRight = "2px solid #404040";
                    e.currentTarget.style.borderBottom = "2px solid #404040";
                  }}
                >
                  Run ↵
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}