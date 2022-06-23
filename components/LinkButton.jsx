import React from "react";

const LinkButton = ({ text = "", url = "", type = "", icon = "" }) => {
	return (
		<div className="flex mt-4 w-full lg:mt-6">
			<a
				href={url}
				className="inline-flex justify-center items-center w-full py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
			>
				{text}
			</a>
		</div>
	);
};

export default LinkButton;
