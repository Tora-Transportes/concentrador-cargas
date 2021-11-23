import React from "react";
import { FormControl } from "react-bootstrap";

function AutocompleteInput({
	options,
	onChange,
	onBlur,
	keyDataList,
	...props
}) {
	let input;
	function handleBlur() {
		if (input) {
			const exists = options.find((i) => i === input.value);
			if (!exists) {
				input.value = "";
			}
			if (typeof onChange === "function") {
				onChange({ target: input });
			}
		}
		if (typeof onBlur === "function") {
			onBlur({ target: input });
		}
	}

	return (
		<>
			<FormControl
				ref={(i) => {
					input = i;
				}}
				{...props}
				autoComplete="off"
				list={keyDataList}
				onChange={onChange}
				placeholder=". . ."
				onBlur={handleBlur}
			/>
			<datalist id={keyDataList}>
				{options?.map((i) => (
					<option key={i} value={i} />
				))}
			</datalist>
		</>
	);
}

export default AutocompleteInput;
