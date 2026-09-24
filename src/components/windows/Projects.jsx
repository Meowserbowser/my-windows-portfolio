// 🔧 ADD YOUR PROJECTS HERE — just extend the `projects` array below
const projects = [
  {
    title: "Project One",
    description: "A short description of what this project does.",
    tech: ["React", "Node.js"],
    link: "#",
  },
  {
    title: "Project Two",
    description: "Another cool project you built.",
    tech: ["Python", "FastAPI"],
    link: "#",
  },
];

export default function Projects() {
  return (
    <div style={{ fontFamily: "'Courier New', monospace" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px", borderBottom: "1px solid #808080", paddingBottom: "4px" }}>
        💼 Projects
      </h2>
      {projects.map((p, i) => (
        <div key={i} style={{ marginBottom: "16px", padding: "8px", border: "1px solid #c0c0c0", background: "#f5f5f5" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>{p.title}</div>
          <div style={{ fontSize: "12px", margin: "4px 0" }}>{p.description}</div>
          <div style={{ fontSize: "11px", color: "#606060" }}>Tech: {p.tech.join(", ")}</div>
          <a href={p.link} style={{ fontSize: "11px", color: "#0000cc" }}>🔗 View Project</a>
        </div>
      ))}
    </div>
  );
}