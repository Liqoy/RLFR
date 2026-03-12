import { getDb } from "../lib/mongo.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const data = req.body || {};

    const db = await getDb();
    const collection = db.collection("clips");

    // Gérer la suppression si l'action est "delete"
    if (data.action === "delete" && data.clipId) {
      const result = await collection.deleteOne({ id: data.clipId });
      if (result.deletedCount === 1) {
        return res.status(200).json({ ok: true, message: "Clip supprimé" });
      } else {
        return res.status(404).json({ ok: false, message: "Clip introuvable" });
      }
    }

    // Sinon, c'est un nouvel enregistrement
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
