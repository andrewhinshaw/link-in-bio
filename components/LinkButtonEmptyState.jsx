import React from "react";

const LinkButtonEmptyState = () => {
	return (
		<div className="flex mt-4 w-full lg:mt-6">
			<a className="hover:cursor-pointer inline-flex justify-center items-center w-full py-2 px-4 text-sm font-medium text-center text-gray-400 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200">
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
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</a>
		</div>
	);
};

export default LinkButtonEmptyState;
