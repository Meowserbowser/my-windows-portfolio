import React from "react";

export default function ContactMe({ data = {} }) {
  const intro = data?.intro || "Let's create something fun together!";
  const email = data?.email || "eaintmonmonkyi2@gmail.com";
  const github = data?.github || "https://github.com/Meowserbowser";
  const linkedin = data?.linkedin || "https://linkedin.com/in/eaintmon";

  const getCleanUrl = (url) => url?.replace(/^https?:\/\//, "");

  return (
    <div style={{ fontFamily: "'Space Grotesk', monospace", lineHeight: 1.8 }} className="p-4 bg-white h-full overflow-y-auto">
      <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px", borderBottom: "1px solid #808080", paddingBottom: "4px" }}>
        Contact 
      </h2>
      <p>{intro}</p>
      <br />
      {email && (
        <p>
          <strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: "#0000cc" }}>{email}</a>
        </p>
      )}
      {github && (
        <p>
          <strong>GitHub:</strong> <a href={github} target="_blank" rel="noreferrer" style={{ color: "#0000cc" }}>{getCleanUrl(github)}</a>
        </p>
      )}
      {linkedin && (
        <p>
          <strong>LinkedIn:</strong> <a href={linkedin} target="_blank" rel="noreferrer" style={{ color: "#0000cc" }}>{getCleanUrl(linkedin)}</a>
        </p>
      )}
      <br />
    </div>
  );
}