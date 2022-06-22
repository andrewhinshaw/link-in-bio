import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(422).json({ error: "Missing required parameter slug" });
  }

  const slugExists = await prisma.userLinkPage.findUnique({
    where: { slug: slug }
  });

  // This slug is available if it doesn't already exist
  res.status(200).json({ isAvailable: !slugExists });
}