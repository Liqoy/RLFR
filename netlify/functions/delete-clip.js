import { getDb } from "./lib/mongo.js";

export const handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    // Extraire l'ID de différentes manières selon l'hébergeur
    let clipId = null;
    
    // Netlify Functions
    if (event.pathParameters && event.pathParameters.clipId) {
      clipId = event.pathParameters.clipId;
    }
    // Alternative: parser le path manuellement
    else if (event.path) {
      const pathParts = event.path.split('/');
      clipId = pathParts[pathParts.length - 1];
    }
    // Alternative: parser du query string
    else if (event.queryStringParameters && event.queryStringParameters.id) {
      clipId = event.queryStringParameters.id;
    }
    
    console.log(`[delete-clip] Tentative de suppression ID: ${clipId}`);
    console.log(`[delete-clip] Event path: ${event.path}`);
    console.log(`[delete-clip] Event params:`, JSON.stringify(event.pathParameters));
    console.log(`[delete-clip] Event query:`, JSON.stringify(event.queryStringParameters));
    
    if (!clipId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Clip ID manquant", debug: { path: event.path, params: event.pathParameters, query: event.queryStringParameters } }),
      };
    }

    const db = await getDb();
    const collection = db.collection("clips");

    const result = await collection.deleteOne({ id: clipId });
    console.log(`[delete-clip] Résultat MongoDB: ${JSON.stringify(result)}`);

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Clip non trouvé", clipId: clipId }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Clip supprimé", clipId: clipId, deleted: result.deletedCount }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de la suppression", details: error.message }),
    };
  }
};
