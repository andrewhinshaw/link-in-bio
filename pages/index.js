import React from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import LoginButton from "../components/LoginButton";
import randomWords from "random-words";
import prisma from "../lib/prisma";

const Home = ({ session, user, randomSlug }) => {	

	const newLinkPageMarkup = (
		<div>
			<a href="#">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Claim your link page now!</h5>
			</a>
			<p className="mb-3 font-normal text-gray-700">Store all your favorite links in one place. Check availability below👇</p>
			<div className="flex mb-4">
				<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
					linkinbio.com/
				</span>
				<input type="text" id="website-admin" className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5" placeholder={randomSlug} />
			</div>
			<a href="#" className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
				Check availability
				<svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
			</a>
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
		include: { userLinkPage: true },
	});

	let randomSlug;

	while (true) {
		const myWords = randomWords(2);
		randomSlug = myWords[0] + "-" + myWords[1];
		const slugExists = await prisma.userLinkPage.findUnique({
			where: { slug: randomSlug }
		});
		
		if (!slugExists) break;
	}

	console.log(randomSlug);
	
	// Used to convert datetime fields to strings before returning
	const user = JSON.parse(JSON.stringify(result));

	return { props: { session, user, randomSlug } };
};

export default Home;
export { getServerSideProps };
