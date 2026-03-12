import { getDb } from "./lib/mongo.js";

export const handler = async (event) => {
  // Accepter GET pour tester, DELETE pour supprimer
  if (event.httpMethod !== "DELETE" && event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    let clipId = null;
    
    // Parser le body pour DELETE
    if (event.httpMethod === "DELETE" && event.body) {
      const body = JSON.parse(event.body);
      clipId = body.clipId;
    }
    // Parser le query string pour GET/DELETE
    else if (event.queryStringParameters && event.queryStringParameters.id) {
      clipId = event.queryStringParameters.id;
    }
    
    console.log(`[delete-clip-proxy] ID reçu: ${clipId}`);
    console.log(`[delete-clip-proxy] Méthode: ${event.httpMethod}`);
    console.log(`[delete-clip-proxy] Body: ${event.body}`);
    console.log(`[delete-clip-proxy] Query: ${JSON.stringify(event.queryStringParameters)}`);
    
    if (!clipId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Clip ID manquant" }),
      };
    }

    const db = await getDb();
    const collection = db.collection("clips");

    const result = await collection.deleteOne({ id: clipId });
    console.log(`[delete-clip-proxy] Résultat: ${JSON.stringify(result)}`);

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Clip non trouvé", clipId: clipId }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Clip supprimé", clipId: clipId }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de la suppression", details: error.message }),
    };
  }
};
