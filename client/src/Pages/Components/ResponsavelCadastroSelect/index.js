import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import ServiceUsuarios from "../../../services/ServiceUsuarios";

function ResponsavelCadastroSelect(props) {
	const [responsaveis, setResponsaveis] = useState([]);
	useEffect(() => {
		let isMounted = true;
		ServiceUsuarios.search({ q: "", page: 1 }).then((response) => {
			if (isMounted) setResponsaveis(response.data.data.results);
		});
		return () => {
			isMounted = false;
		};
	}, []);
	return (
		<Form.Select {...props}>
			<option></option>
			{responsaveis.map((i) => (
				<option key={i.oid}>{i.nome}</option>
			))}
		</Form.Select>
	);
}

export default ResponsavelCadastroSelect;
