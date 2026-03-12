import { getDb } from "./lib/mongo.js";

export const handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const clipId = event.pathParameters?.clipId;
    
    if (!clipId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Clip ID manquant" }),
      };
    }

    const db = await getDb();
    const collection = db.collection("clips");

    const result = await collection.deleteOne({ id: clipId });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Clip non trouvé" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Clip supprimé" }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de la suppression" }),
    };
  }
};
