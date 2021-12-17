import React, { useState, useEffect } from "react";
import ServiceSituacoesCargas from "../../../services/ServiceSituacoesCargas";
import { Form } from "react-bootstrap";

let cacheSituacoes = null;

function CaptionStatusCarga({ children, ...rest }) {
	const [situacoes, setSituacoes] = useState([]);
	useEffect(() => {
		if (cacheSituacoes) {
			setSituacoes(cacheSituacoes);
		} else {
			ServiceSituacoesCargas.search().then(({ data }) => {
				cacheSituacoes = data.data;
				setSituacoes(data.data);
			});
		}
	}, []);
	return (
		<Form.Select {...rest}>
			{children}
			{situacoes.map((i) => (
				<option key={i.id} value={i.id}>
					{i.descricao}
				</option>
			))}
		</Form.Select>
	);
}

export default CaptionStatusCarga;
