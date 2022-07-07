import React, { useState, useRef } from "react";

const LinkButton = ({
	displayText = "Ayo",
	url = "https://twitter.com/whatsgoodly",
	type = "",
	icon = "",
	id = "cl4oxtuai0038azsjy5sp1kk8",
	isPageEditingModeEnabled,
}) => {
	const [isHoveringOverLinkContainer, setIsHoveringOverLinkContainer] =
		useState(false);
	const [isLinkEditingModeEnabled, setIsLinkEditingModeEnabled] =
		useState(false);
	const originalLinkData = useRef({
		displayText: displayText,
		url: url,
	});
	const [linkData, setLinkData] = useState({
		displayText: displayText,
		url: url,
	});

	const handleChangeLinkDisplayText = (e) => {
		setLinkData({ ...linkData, displayText: e.target.value });
	};

	const handleChangeLinkUrl = (e) => {
		setLinkData({ ...linkData, url: e.target.value });
	};

	const handleMouseOverLinkContainer = () => {
		setIsHoveringOverLinkContainer(true);
	};

	const handleMouseOutOfLinkContainer = () => {
		setIsHoveringOverLinkContainer(false);
	};

	const handleEnableEditingLink = () => {
		setIsLinkEditingModeEnabled(true);
	};

	const handleDisableEditingLink = () => {
		setIsLinkEditingModeEnabled(false);
	};

	const handleSaveLink = async (e) => {
		e.preventDefault();

		// Check if there are any changes to be saved
		if (
			originalLinkData.current.displayText != linkData.displayText ||
			originalLinkData.current.url != linkData.url
		) {
			// Send POST request to server to update user page
			const result = await fetch(`/api/links?linkId=${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					displayText: linkData.displayText,
					url: linkData.url,
				}),
			});
			const resultJson = await result.json();
			const link = resultJson?.link;

			if (!link) {
				console.error("Unable to save link data", result);
				setIsLinkEditingModeEnabled(false);
				return;
			}
		}

		setIsLinkEditingModeEnabled(false);
	};

	const handleCancelLinkEdit = async (e) => {
		e.preventDefault();
		setLinkData({
			...linkData,
			displayText: originalLinkData.current.displayText,
			url: originalLinkData.current.url,
		});
		setIsLinkEditingModeEnabled(false);
	};

	const handleDeleteLink = () => {
		console.log("Deleting link!");

		// TODO: Delete this link
	};

	const editingLinkMarkup = isLinkEditingModeEnabled && <div>I'm editing!</div>;

	const linkEditingModeButtonsMarkup = isPageEditingModeEnabled &&
		isHoveringOverLinkContainer && (
			<div
				className="absolute flex right-0 items-center"
				style={{ gridArea: "1 / 1" }}
				onMouseOver={handleMouseOverLinkContainer}
				onMouseOut={handleMouseOutOfLinkContainer}
			>
				{/* Edit link button */}
				<a
					className="mr-1 p-1 text-gray-700 rounded-md cursor-pointer bg-gray-100 hover:text-blue-500"
					onClick={handleEnableEditingLink}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				</a>

				{/* Delete link button */}
				<a
					className="mr-2 p-1 text-gray-700 rounded-md cursor-pointer bg-gray-100 hover:text-red-500"
					disabled={true}
					onClick={handleDeleteLink}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</a>
			</div>
		);

	return (
		<div
			className="grid relative items-center mt-4 w-full lg:mt-6"
			onMouseOver={handleMouseOverLinkContainer}
			onMouseOut={handleMouseOutOfLinkContainer}
		>
			{isLinkEditingModeEnabled ? (
				<>
					<div className="flex justify-start items-center w-full p-3 text-sm font-medium text-center text-gray-900 rounded-lg border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200">
						<form className="w-full">
							<div className="mb-3 w-full">
								<label
									htmlFor="email"
									className="block mb-2 text-xs font-medium text-gray-900 text-left"
								>
									Display Text
								</label>
								<input
									type="text"
									id="linkDisplayText"
									value={linkData.displayText}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
									placeholder="Check out my Twitter!"
									onChange={handleChangeLinkDisplayText}
									required
								/>
							</div>
							<div className="relative mb-4 w-full">
								<label
									htmlFor="email"
									className="block mb-2 text-xs font-medium text-gray-900 text-left"
								>
									Link URL
								</label>
								<div className="relative w-full">
									<input
										type="url"
										value={linkData.url}
										id="linkUrl"
										pattern="https://.*"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
										placeholder="https://twitter.com/elonmusk"
										onChange={handleChangeLinkUrl}
										required
									/>
								</div>
							</div>
							<div className="flex flex-row space-x-2 justify-center">
								<button
									className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto px-4 py-2 text-center"
									onClick={(e) => handleSaveLink(e)}
								>
									Save
								</button>
								<button
									type="reset"
									className="text--gray-900 bg-white hover:bg-gray-100 border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto px-4 py-2 text-center"
									onClick={(e) => handleCancelLinkEdit(e)}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</>
			) : (
				<>
					<a
						href={isPageEditingModeEnabled ? null : linkData.url}
						target="_blank"
						rel="noopener noreferrer"
						className={`flex justify-center items-center w-full py-2 px-4 text-sm font-medium text-center text-gray-900 rounded-lg border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 ${
							isPageEditingModeEnabled ? "cursor-default" : "cursor-pointer"
						} ${isHoveringOverLinkContainer ? "bg-gray-100" : "bg-white"}`}
						style={{ gridArea: "1 / 1" }}
					>
						{linkData.displayText}
					</a>
					{linkEditingModeButtonsMarkup}
				</>
			)}
		</div>
	);
};

export default LinkButton;
