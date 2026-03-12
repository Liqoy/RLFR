import { getDb } from "./lib/mongo.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const db = await getDb();
    const collection = db.collection("clips");

    await collection.insertOne({
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
      body: "Error saving clip",
    };
  }
};
