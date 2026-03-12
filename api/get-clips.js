import { getDb } from "../lib/mongo.js";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const collection = db.collection("clips");

    const clips = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    console.log("Clips fetched from DB:", JSON.stringify(clips[0] || {}, null, 2));

    res.status(200).json(
      clips.map((clip) => ({
        ...clip,
        _id: String(clip._id),
      }))
    );
  } catch (error) {
    console.error("get-clips error:", error);
    res.status(500).json({
      ok: false,
      message: error.message || String(error),
    });
  }
}
