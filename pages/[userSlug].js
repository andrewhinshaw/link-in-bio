import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LinkButton from "../components/LinkButton";
import LinkButtonEmptyState from "../components/LinkButtonEmptyState";
import prisma from "../lib/prisma";

const LinkPage = ({ userPageData }) => {
  const router = useRouter();
  const { userSlug } = router.query;

  if (!userPageData) {
    return (
      <div>This page does not exist</div>
    );
  }

  const displayNameMarkup = (
    <h5 className="mt-12 text-xl font-medium text-gray-900">{userPageData.displayName ? userPageData.displayName : userPageData.slug}</h5>
  );

  const occupationMarkup = userPageData?.occupation && typeof userPageData.occupation != "null" ? (
    <span className="text-base text-gray-700 mb-3">{userPageData.occupation}</span>
  ) : null;

  const locationMarkup = userPageData?.location && typeof userPageData.location != "null" ? (
    <div className="flex flex-row text-gray-400 justify-center items-center mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      <span className="text-sm text-gray-400 ml-1">{userPageData.location}</span>
    </div>
  ) : null;

  const descriptionMarkup = userPageData?.description && typeof userPageData.description != "null" ? (
    <span className="text-sm text-gray-700 mb-3">{userPageData.description}</span>
  ) : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start mt-48">
      <div className="max-w-lg w-full bg-white rounded-lg border border-gray-200 shadow-md p-8">
        <div className="flex flex-col items-center">
          <img className="absolute -translate-y-24 mb-3 w-32 h-32 rounded-full shadow-lg" src={userPageData.user.image} alt="Bonnie image" />
          {displayNameMarkup}
          {occupationMarkup}
          {locationMarkup}
          {descriptionMarkup}
          <LinkButton url="https://twitter.com" text="Follow my tweets!" />
          <LinkButtonEmptyState />
        </div>
      </div>
    </div>
  );
};

const getServerSideProps = async ({ req, res, params }) => {
  const slug = params.userSlug;

  // Get the link page for this page's username
  let userPageData = null;
  try {
    userPageData = await prisma.page.findUnique({
      where: { slug: slug },
      include: {
        user: true
      }
    });

    // Used to convert datetime fields to strings before returning
    userPageData = JSON.parse(JSON.stringify(userPageData));

  } catch (err) {
    console.error(err);
  }

  return {
    props: { userPageData },
  };
}

export default LinkPage;
export { getServerSideProps };
