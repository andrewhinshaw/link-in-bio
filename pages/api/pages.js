import { getSession, useSession } from "next-auth/react";
import { getPageFiles } from "next/dist/server/get-page-files";
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
}

const createPage = async (req, res) => {
  const { session, user } = await getSessionAndUser(req, res);

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

const updatePage = async (req, res) => {
  const { session, user } = await getSessionAndUser(req, res);

  // If no body is provide, reject the request with 422
  if (!req.body) {
    res.status(422).json({ error: "No request body provided" });
  }

  // Grab the necessary values from the body if they are provided
  let data = {};
  if (req.body?.displayName) data.displayName = req.body?.displayName;
  if (req.body?.occupation) data.occupation = req.body?.occupation;
  if (req.body?.location) data.location = req.body?.location;
  if (req.body?.description) data.description = req.body?.description;

  // If data object is empty, no valid values were found in request body
  if (Object.keys(data).length == 0) {
    res.status(422).json({ error: "No valid values provided in request body" });
  }

  // Use prisma to update the page with the data from the request body
  const updatePage = await prisma.page.update({
    where: {
      userId: user.id,
    }, 
    data: data
  });

  // If updated successfully, return the updated page in the response
  if (updatePage.id) {
    res.status(200).json({ page: updatePage });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
}

export default async function handler(req, res) {
  if (req.method == "POST") {
    await createPage(req, res);
  } else if (req.method == "PUT") {
    await updatePage(req, res);
  }
}
