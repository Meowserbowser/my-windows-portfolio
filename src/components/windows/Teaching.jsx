// 🔧 ADD YOUR TEACHING CONTENT HERE — extend the `courses` array below
const courses = [
  {
    title: "Intro to Web Development",
    description: "A beginner course covering HTML, CSS, and JavaScript.",
    level: "Beginner",
  },
  {
    title: "Advanced React Patterns",
    description: "Deep dive into hooks, context, and performance.",
    level: "Advanced",
  },
];

export default function Teaching() {
  return (
    <div style={{ fontFamily: "'Courier New', monospace" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px", borderBottom: "1px solid #808080", paddingBottom: "4px" }}>
        📚 Teaching
      </h2>
      {courses.map((c, i) => (
        <div key={i} style={{ marginBottom: "16px", padding: "8px", border: "1px solid #c0c0c0", background: "#f5f5f5" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>{c.title}</div>
          <div style={{ fontSize: "12px", margin: "4px 0" }}>{c.description}</div>
          <span style={{ fontSize: "11px", background: "#000080", color: "#fff", padding: "1px 6px" }}>
            {c.level}
          </span>
        </div>
      ))}
    </div>
  );
}