import React, { useState, useEffect } from "react";
import ServiceSituacoesCargas from "../../../services/ServiceSituacoesCargas";
import StatusTooltip from "../StatusTooltip";
import { Accordion, Table } from "react-bootstrap";

function CaptionStatusCarga() {
	const [situacoes, setSituacoes] = useState([]);
	useEffect(() => {
		ServiceSituacoesCargas.search().then(({ data }) => {
			setSituacoes(data.data);
		});
	}, []);
	return (
		<Accordion>
			<Accordion.Item eventKey="0">
				<Accordion.Header>Situação das cargas</Accordion.Header>
				<Accordion.Body>
					<Table>
						<thead>
							<tr>
								<th>Cor</th>
								<th>Descrição</th>
							</tr>
						</thead>
						<tbody>
							{situacoes.map((i) => (
								<tr key={i.id}>
									<td>
										<StatusTooltip color={i.cor} hint={null} />
									</td>
									<td>{i.descricao}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
}

export default CaptionStatusCarga;
