import { getDb } from "./lib/mongo.js";

export const handler = async () => {
  try {
    const db = await getDb();
    const collection = db.collection("clips");

    const clips = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clips),
    };
  } catch (error) {
    console.error("get-clips error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: false,
        message: error?.message || String(error),
      }),
    };
  }
};
