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
    if (data.action === "delete" && (data.clipId || data.id)) {
      const idToDelete = data.clipId || data.id;
      const result = await collection.deleteOne({ id: idToDelete });
      if (result.deletedCount === 1) {
        return res.status(200).json({ ok: true, message: "Clip supprimé" });
      } else {
        return res.status(404).json({ ok: false, message: "Clip introuvable" });
      }
    }

    // Générer un ID aléatoire si manquant (format H3AT3GVM)
    if (!data.id) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randomId = "";
      for (let i = 0; i < 8; i++) {
        randomId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      data.id = randomId;
    }

    // Sinon, c'est un nouvel enregistrement
    await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    res.status(200).json({ ok: true, id: data.id });
  } catch (error) {
    console.error("save-clip error:", error);
    res.status(500).json({
      ok: false,
      message: error.message || String(error),
    });
  }
}
