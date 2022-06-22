import { getSession, useSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createLink = async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
  if (!session) {
    return res.status(401).json({ unauthorized: true });
  }

  const sessionRecord = await prisma.session.findUnique({
    where: { sessionToken: session.sessionToken }
  });

  const user = await prisma.user.findUnique({ 
    where: { id: sessionRecord.userId } 
  });

  if (!req.body.linkType || !req.body.linkUrl) {
    res.status(500).json({ error: 'Validation error' });
  }

  const link = await prisma.link.create({
    data: {
      userId: user.id,
      linkType: req.body.linkType,
      linkUrl: req.body.linkUrl
    }
  });

  if (link.id) {
    res.status(200).json(link);
  } else {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default async function handler(req, res) {
  if (req.method == 'POST') {
    await createLink(req, res);
  }
}