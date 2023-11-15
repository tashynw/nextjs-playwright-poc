import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await db.user.deleteMany({
      where: {
        email: {
          contains: "tester",
        },
      },
    });

    return res.status(200).json(`Cleanup successful`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Server error` });
  }
}
