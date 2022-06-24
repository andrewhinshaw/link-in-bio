import React, { useState } from "react";

const EditButton = ({ changesExist, setIsEditingFromChild }) => {
	const [isHovering, setIsHovering] = useState(false);
	const handleMouseOver = () => {
		setIsHovering(true);
		if (isEditing && changesExist && !setShowTrashIcon) {
			setShowTrashIcon(true);
			showCloseIcon(false);
		}
	};
	const handleMouseOut = () => {
		setIsHovering(false);
		if (isEditing && changesExist) {
			setShowTrashIcon(false);
			showCloseIcon(true);
		}
	};

	const [isEditing, setIsEditing] = useState(false);
	const handleToggleEditing = () => {
		setIsEditing(!isEditing);
		setIsEditingFromChild(!isEditing);
	};

	const [showTrashIcon, setShowTrashIcon] = useState(false);
	const [showCloseIcon, setShowCloseIcon] = useState(false);
	const [showEditIcon, setShowEditIcon] = useState(true);

	const icons = [
		{
			key: "edit",
			text: "Edit page",
			visible: true,
		},
		{
			key: "close",
			text: "Close editor",
			visible: false,
		},
		{
			key: "edit",
			text: "Discard changes",
			visible: false,
		},
	];

	const editIcon = (
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
	);

	const closeIcon = (
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
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	);

	const trashIcon = (
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
	);

	return (
		<a
			onClick={handleToggleEditing}
			className="rounded-full p-2 cursor-pointer hover:bg-gray-100 text-gray-500"
		>
			{isEditing ? (
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
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			) : (
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
			)}
		</a>
	);
};

export default EditButton;
