import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("auth-module"); // you can change db name if needed
    res.status(200).json({ message: "DB connected successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB connection failed" });
  }
}
