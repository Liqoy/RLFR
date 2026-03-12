import { getDb } from "./lib/mongo.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    
    // Gérer l'action de suppression
    if (data.action === 'delete' && data.clipId) {
      console.log(`[save-clip] Action de suppression pour ID: ${data.clipId}`);
      
      const db = await getDb();
      const collection = db.collection("clips");

      const result = await collection.deleteOne({ id: data.clipId });
      console.log(`[save-clip] Résultat suppression: ${JSON.stringify(result)}`);

      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Clip non trouvé", clipId: data.clipId }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: "Clip supprimé", clipId: data.clipId }),
      };
    }

    // Sauvegarder un nouveau clip (fonctionnalité originale)
    const db2 = await getDb();
    const collection2 = db2.collection("clips");

    // Détection de doublon par nom de fichier (ou URL à défaut)
    const duplicateKey = data.fileName || data.filename || data.name || data.url;

    if (duplicateKey) {
      const existing = await collection2.findOne({
        $or: [
          { fileName: duplicateKey },
          { filename: duplicateKey },
          { name: duplicateKey },
          { url: duplicateKey },
        ],
      });

      if (existing) {
        return {
          statusCode: 409,
          body: JSON.stringify({
            ok: false,
            duplicate: true,
            message: "Un clip avec ce fichier existe déjà.",
          }),
        };
      }
    }

    await collection2.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error saving clip", details: error.message }),
    };
  }
};
