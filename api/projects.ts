import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        link TEXT,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    if (req.method === "GET") {
      const { rows } = await sql`SELECT * FROM projects ORDER BY created_at DESC;`;
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { title, description, link, image_url } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }

      const { rows } = await sql`
        INSERT INTO projects (title, description, link, image_url)
        VALUES (${title}, ${description}, ${link || null}, ${image_url || null})
        RETURNING *;
      `;
      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}