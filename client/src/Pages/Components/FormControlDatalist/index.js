import React from "react";
import { Form } from "react-bootstrap";

function FormControlDatalist({ listId, list, ...props }) {
	return (
		<>
			<Form.Control list={listId} {...props} />
			<datalist id={listId}>
				{list?.map((i, key) => (
					<option key={key} value={i}>
						{i}
					</option>
				))}
			</datalist>
		</>
	);
}

export default FormControlDatalist;
