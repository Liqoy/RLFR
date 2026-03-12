import { getDb } from "../lib/mongo.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const data = req.body || {};

    const db = await getDb();
    const collection = db.collection("clips");

    await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("save-clip error:", error);
    res.status(500).json({
      ok: false,
      message: error.message || String(error),
    });
  }
}
