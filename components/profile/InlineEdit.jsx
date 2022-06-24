import React, { useState, useEffect } from "react";

const InlineEdit = ({
  identifier,
	value,
	setValue,
	isEditing,
	reset,
	setReset,
	className,
}) => {
	const [editingValue, setEditingValue] = useState(value);

	useEffect(() => {
		if (reset) {
			setEditingValue(value);
			setReset(false);
		}
	}, [reset]);

	const onChange = (event) => setEditingValue(event.target.value);

	const onKeyDown = (event) => {
		if (event.key === "Enter" || event.key === "Escape") {
			event.target.blur();
		}
	};

	const onBlur = (event) => {
		if (event.target.value.trim() === "") {
			setEditingValue(value);
		} else {
			const newValue = { [identifier]: event.target.value };
			setValue(newValue);
		}
	};

	return isEditing ? (
		<input
			type="text"
			aria-label="displayName"
			value={editingValue}
			onChange={onChange}
			onKeyDown={onKeyDown}
			onBlur={onBlur}
			placeholder="Enter display name..."
			className={`${className} w-full hover:cursor-pointer text-center rounded-lg focus:cursor-text hover:bg-gray-100 focus:bg-gray-100 focus:z-10`}
		/>
	) : (
		<span className={`${className}`}>{value}</span>
	);
};

export default InlineEdit;
