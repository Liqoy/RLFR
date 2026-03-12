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
      body: JSON.stringify(clips),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Error loading clips",
    };
  }
};
