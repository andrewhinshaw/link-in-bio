import { getSession, useSession } from "next-auth/react";
import { getPageFiles } from "next/dist/server/get-page-files";
import prisma from "../../lib/prisma";

const createPage = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ unauthorized: true });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!req.body.slug) {
    res.status(500).json({ error: "Validation error" });
  }

  const page = await prisma.page.create({
    data: {
      userId: user.id,
      slug: req.body.slug,
    },
  });

  if (page.id) {
    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hasPage: true,
      },
    });
    res.status(200).json({ page: page });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    await createPage(req, res);
  }
}
