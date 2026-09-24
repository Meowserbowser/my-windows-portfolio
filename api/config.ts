import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_config (
        id INT PRIMARY KEY,
        data JSONB NOT NULL
      );
    `;

    const defaultConfig = {
      background: { type: "color", value: "#008080" },
      about: {
        photoUrl: "",
        name: "Eaint Mon Mon Kyi",
        subtitle: "ICT Student & Creative Developer",
        email: "eaintmonmonkyi2@gmail.com",
        website: "portfolio.os",
        idNumber: "ID #2026",
        backHeader: "PERSONNEL FILE // ABOUT ME",
        bio: "Third-year Information & Communication Technology undergraduate specializing in interactive software, front-end architecture, and applied AI systems. Passionate about retro UI design, responsive interactive web canvases, and tactile micro-interactions.",
        status: "Status: Available for hire"
      },
      teaching: [
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
      ],
      contact: {
        intro: "Let's create something fun together!",
        email: "eaintmonmonkyi2@gmail.com",
        github: "https://github.com/Meowserbowser",
        linkedin: "https://linkedin.com/in/eaintmon"
      },
      customWindows: []
    };

    if (req.method === "GET") {
      const { rows } = await sql`SELECT data FROM portfolio_config WHERE id = 1;`;
      if (rows.length === 0) {
        await sql`INSERT INTO portfolio_config (id, data) VALUES (1, ${JSON.stringify(defaultConfig)});`;
        return res.status(200).json(defaultConfig);
      }
      return res.status(200).json(rows[0].data);
    }

    if (req.method === "POST") {
      const newData = req.body;
      await sql`
        INSERT INTO portfolio_config (id, data) 
        VALUES (1, ${JSON.stringify(newData)})
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
      `;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}