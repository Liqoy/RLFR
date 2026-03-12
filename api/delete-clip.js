import { getDb } from "../lib/mongo.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { clipId } = req.body;
    if (!clipId) {
      return res.status(400).json({ ok: false, error: "clipId manquant" });
    }

    const db = await getDb();
    const collection = db.collection("clips");

    const result = await collection.deleteOne({ id: clipId });

    if (result.deletedCount === 1) {
      return res.status(200).json({ ok: true, message: "Clip supprimé" });
    } else {
      return res.status(404).json({ ok: false, message: "Clip introuvable" });
    }
  } catch (error) {
    console.error("delete-clip error:", error);
    res.status(500).json({
      ok: false,
      message: error.message || String(error),
    });
  }
}
