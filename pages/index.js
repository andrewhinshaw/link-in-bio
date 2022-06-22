import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import LoginButton from "../components/LoginButton";
import LoadingSpinner from "../components/LoadingSpinner";
import randomWords from "random-words";
import prisma from "../lib/prisma";
import { Router } from "next/router";

const styles = {
	input: {
		ok: "rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5",
		error: "rounded-none rounded-r-lg bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 block w-full text-sm  p-2.5"
	}
}

const Home = ({ session, user, randomSlug }) => {

	const router = useRouter();

	const [userEnteredSlug, setUserEnteredSlug] = useState(undefined);

	const [isUserEnteredSlugValidCharacters, setIsUserEnteredSlugValidCharacters] = useState(true);
	const [isUserEnteredSlugValidLength, setIsUserEnteredSlugValidLength] = useState(true);
	const [isUserEnteredSlugAvailable, setIsUserEnteredSlugAvailable] = useState(true);
	const [isUserEnteredSlugFullyValidated, setIsUserEnteredSlugFullyValidated] = useState(true);

	const [loadingCheckAvailability, setLoadingCheckAvailability] = useState(false);
	const handleCheckAvailability = async () => {
		const result = await fetch(`/api/users/check-availability?slug=${userEnteredSlug}`);
		const resultJson = await result.json();
		return resultJson.isAvailable;
	}

	const validateAndSubmitForm = async (e) => {
		e.preventDefault();

		// Characters used must be letters, numbers, or underscores
		const isValidCharacters = /^(?:[A-Za-z0-9_]+)$/.test(userEnteredSlug);
		setIsUserEnteredSlugValidCharacters(isValidCharacters);

		// Length of slug must be greater than or equal to 3
		const slugLength = typeof userEnteredSlug == "string" ? userEnteredSlug.length : 0;
		const isValidLength = slugLength >= 3;
		setIsUserEnteredSlugValidLength(isValidLength);

		// If characters or length not valid, we can skip the availability check
		if (!isValidCharacters || !isValidLength) {
			setIsUserEnteredSlugFullyValidated(false);
			return
		}

		setLoadingCheckAvailability(true);

		// Slug must be available for use, check availability via api call
		const isAvailable = await handleCheckAvailability();
		setIsUserEnteredSlugAvailable(isAvailable);

		// Finally, we can determine if the slug has passed all checks
		const isFullyValidated = isValidCharacters && isValidLength && isAvailable;
		setIsUserEnteredSlugFullyValidated(isFullyValidated);

		if (isFullyValidated) {
			// Send POST request to server to create new userLinkPage
			const result = await fetch("/api/pages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ slug: userEnteredSlug })
			});
			const resultJson = await result.json();
			const page = resultJson?.page;

			if (page) {
				router.push(`/${userEnteredSlug}`);
			}
		}

		setLoadingCheckAvailability(false);
	}

	const newLinkPageMarkup = (
		<div>
			<a href="#">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">All your links in one place</h5>
			</a>
			<p className="mb-3 font-normal text-gray-700">Claim your link page now👇</p>
			<form onSubmit={(e) => validateAndSubmitForm(e)}>
				<div className="mb-4">
					<div className="flex">
						<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
							linkinbio.com/
						</span>
						<input name="slug" type="text" onChange={(e) => {
							setUserEnteredSlug(e.target.value)
						}} className={isUserEnteredSlugFullyValidated ? styles.input.ok : styles.input.error} placeholder={randomSlug} />
					</div>
					{userEnteredSlug == "" &&
						<p className="mt-2 text-xs text-red-600 dark:text-red-500">Please enter a link page URL</p>
					}
					{!isUserEnteredSlugValidCharacters &&
						<p className="mt-2 text-xs text-red-600 dark:text-red-500">Link page URLs can only contain letters, numbers, and underscores ("_")</p>
					}
					{!isUserEnteredSlugValidLength &&
						<p className="mt-2 text-xs text-red-600 dark:text-red-500">Link page URLs must be at least 3 characters</p>
					}
					{!isUserEnteredSlugAvailable &&
						<p className="mt-2 text-xs text-red-600 dark:text-red-500">This link page URL is not available</p>
					}
				</div>
				<button disabled={loadingCheckAvailability} className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
					{loadingCheckAvailability ? <LoadingSpinner height={16} width={16} color="#fff" /> : "Claim"}
					<svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
				</button>
			</form>
		</div>
	);

	return (
		<div className="flex min-h-screen flex-col items-start justify-center py-2">
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
				<div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
					{newLinkPageMarkup}
				</div>
			</main>

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

const getServerSideProps = async ({ req }) => {
	const session = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: "/api/auth/signin",
				permanent: false,
			},
		};
	}

	const result = await prisma.user.findUnique({
		where: { email: session.user.email },
		include: { pages: true },
	});

	// If a user already has a page, redirect them to their page
	if (result.hasPage && result.pages.length >= 1) {
		return {
			redirect: {
				destination: `/${result.pages[0].slug}`,
				permanent: false
			}
		}
	}

	let randomSlug;

	while (true) {
		const myWords = randomWords(2);
		randomSlug = myWords[0] + "-" + myWords[1];
		const slugExists = await prisma.page.findUnique({
			where: { slug: randomSlug }
		});

		if (!slugExists) break;
	}

	// Used to convert datetime fields to strings before returning
	const user = JSON.parse(JSON.stringify(result));

	return { props: { session, user, randomSlug } };
};

export default Home;
export { getServerSideProps };
