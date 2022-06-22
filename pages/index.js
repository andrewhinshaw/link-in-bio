import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import LoginButton from "../components/LoginButton";

const Home = ({ session }) => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-2">
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
				<LoginButton />
				<button onClick={() => {
					fetch('/api/links', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							linkType: 'twitter',
							linkUrl: 'https://twitter.com/whatever'
						})
					})
				}}>get session</button>
			</main>

			<footer className="flex h-24 w-full items-center justify-center border-t">
				<a
					className="flex items-center justify-center gap-2"
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{" "}
					<Image
						src="/vercel.svg"
						alt="Vercel Logo"
						width={72}
						height={16}
					/>
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
				destination: '/api/auth/signin',
				permanent: false
			}
		}
	}
	return { props: { session } };
}

export default Home;
export { getServerSideProps };
