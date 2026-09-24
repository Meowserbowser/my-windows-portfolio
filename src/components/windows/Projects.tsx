import React, { useEffect, useState } from "react";
import { ProjectItem } from "../../types/portfolio";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: ProjectItem[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Database fetch failed:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="p-4 bg-white h-full overflow-y-auto text-black select-text"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-center">
        <h2 className="text-sm md:text-base font-bold">DIRECTORY: C:\PROJECTS</h2>
        <span className="text-xs text-gray-500">
          [{projects.length} file(s)]
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center">
          <p className="text-xs text-gray-600 animate-pulse">
            Reading records from Vercel Postgres...
          </p>
        </div>
      ) : error ? (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-xs">
          <strong>Disk Read Error:</strong> {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-gray-300 p-6">
          <p className="text-xs text-gray-500 italic">
            Directory empty. No project records present in database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-3 border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 bg-[#c0c0c0] flex flex-col justify-between"
            >
              {proj.image_url && (
                <div className="w-full h-36 overflow-hidden mb-2 border border-gray-600 bg-black">
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-bold text-sm text-[#000080] mb-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-gray-800 mb-2 whitespace-pre-line leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="self-start text-xs font-bold px-2 py-0.5 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-r-white active:border-b-white"
                >
                  Run ↵
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}