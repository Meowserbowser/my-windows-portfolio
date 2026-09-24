import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filename = (req.query.filename as string) || `asset-${Date.now()}.png`;

    const blob = await put(filename, req, {
      access: "public",
    });

    return res.status(200).json(blob);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}