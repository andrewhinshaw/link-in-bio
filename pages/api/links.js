import { getSession, useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

const getSessionAndUser = async (req, rex) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ unauthorized: true });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return { session: session, user: user };
};

const createLink = async (req, res) => {
  const { session, user } = await getSessionAndUser(req, res);

  if (!req.body.linkType || !req.body.linkUrl) {
    res.status(500).json({ error: "Validation error" });
  }

  const link = await prisma.link.create({
    data: {
      userId: user.id,
      type: req.body.linkType,
      url: req.body.linkUrl,
    },
  });

  if (link.id) {
    res.status(200).json(link);
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateLink = async (req, res) => {
  const { session, user } = await getSessionAndUser(req, res);
  const {
    query: { linkId }
  } = req;

  // If no body is provide, reject the request with 422
  if (!req?.body) {
    res.status(422).json({ error: "No request body provided" });
    return;
  }

  // If no linkId is provided, reject the request with 422
  if (!linkId) {
    res.status(422).json({ error: "No linkId provided" });
    return;
  }

  // Grab the necessary values from the body if they are provided
  let data = {};
  if (req.body?.displayText) data.displayText = req.body?.displayText;
  if (req.body?.url) data.url = req.body?.url;

  // If data object is empty, no valid values were found in request body
  if (Object.keys(data).length == 0) {
    res.status(422).json({ error: "No valid values provided in request body" });
  }

  // Use prisma to update the link with the data from the request body
  const updatedLink = await prisma.link.update({
    where: {
      id: linkId,
    },
    data: data,
  });

  // If updated successfully, return the updated link in the response
  if (updatedLink.id) {
    res.status(200).json({ link: updatedLink });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    await createLink(req, res);
  } else if (req.method == "PUT") {
    await updateLink(req, res);
  }
}
