import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import ServiceFiliais from "../../../services/ServiceFiliais";

function FilialSelect(props) {
	const [filiais, setFiliais] = useState([]);
	useEffect(() => {
		(async function () {
			setFiliais((await ServiceFiliais.list()).data.data);
		})();
	}, []);
	return (
		<Form.Select {...props}>
			<option></option>
			{filiais.map((i) => (
				<option key={i.FIL_COD} value={i.FIL_COD}>
					{i.FIL_DSC} - {i.FIL_COD}
				</option>
			))}
		</Form.Select>
	);
}

export default FilialSelect;
