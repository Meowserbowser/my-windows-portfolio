import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure the config table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_config (
        id INT PRIMARY KEY,
        data JSONB NOT NULL
      );
    `;

    // Default configuration if the database is empty
    const defaultConfig = {
      background: { type: "color", value: "#008080" },
      windows: [
        {
          id: "projects",
          label: "Projects",
          icon_url: "/src/assets/projects.png",
          type: "projects", 
          content: ""
        }
      ]
    };

    if (req.method === "GET") {
      const { rows } = await sql`SELECT data FROM portfolio_config WHERE id = 1;`;
      if (rows.length === 0) {
        // Insert default if none exists
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