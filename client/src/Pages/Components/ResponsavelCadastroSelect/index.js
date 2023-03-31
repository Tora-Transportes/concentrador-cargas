import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import ServiceUsuarios from "../../../services/ServiceUsuarios";

let cache = null;

function ResponsavelCadastroSelect({ user, ...props }) {
	const [responsaveis, setResponsaveis] = useState([]);
	useEffect(() => {
		let isMounted = true;
		if (!cache) {
			const tipobusca = user === undefined ? "" : user;
			ServiceUsuarios.searchName({ q: tipobusca, page: 1, user }).then(
				(response) => {
					if (isMounted) {
						setResponsaveis(response.data.data.results);
						cache = response.data.data.results;
					}
				}
			);
		} else {
			setResponsaveis(cache);
		}
		return () => {
			isMounted = false;
		};
	}, []);
	return (
		<Form.Select {...props}>
			<option></option>
			{responsaveis?.map((i, index) => (
				<option key={index} value={props.key_value === "oid" ? i.oid : i.nome}>
					{i.nome}
				</option>
			))}
		</Form.Select>
	);
}

export default ResponsavelCadastroSelect;
