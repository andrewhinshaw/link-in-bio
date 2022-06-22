import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import prisma from "../lib/prisma";

const LinkPage = ({ userLinkPage }) => {
  const router = useRouter();
  const { userSlug } = router.query;

  if (!userLinkPage) {
    return (
      <div>This page does not exist</div>
    );
  }

  console.log(userLinkPage);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>{userSlug}'s Link Page!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  );
};

const getServerSideProps = async ({ req, res, params }) => {
  const slug = params.userSlug;
  
  // Get the link page for this page's username
  let userLinkPage = null;
  try {
    userLinkPage = await prisma.userLinkPage.findUnique({
      where: { slug: slug },
      select: {
        slug: true,
        displayName: true,
        location: true,
      },
    });
    userLinkPage.createdAt = userLinkPage.createdAt.toString();
    userLinkPage.updatedAt = userLinkPage.updatedAt.toString();
  } catch (err) {
    console.error(err);
  }
  
  return {
    props: { userLinkPage },
  };
}

export default LinkPage;
export { getServerSideProps };
