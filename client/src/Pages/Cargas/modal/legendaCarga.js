import React, { useState, useEffect } from "react";
import "./modal.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ServiceSituacoesCargas from "src/services/ServiceSituacoesCargas";
import StatusTooltip from "src/Pages/Components/StatusTooltip";
import Card from "react-bootstrap/Card";
// import { Col } from "react-bootstrap";

export default function LegendaCargas(props) {
	const [situacoes, setSituacoes] = useState([]);
	useEffect(() => {
		ServiceSituacoesCargas.search().then(({ data }) => {
			setSituacoes(data.data);
		});
	}, []);

	return (
		<Modal {...props} className="modal-situation-cargas">
			<Modal.Header id="modal-header">
				<Modal.Title className="modal-title-situ-carg">
					Situação das Cargas
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<>
					<Card className="card-sit-cargas">
						<Card.Body className="card-body-sit-cargas">
							{situacoes.map((item) => (
								<div key={item.id} className="div-situação-cargas">
									<div id="cor-legenda-cargas">
										<td>
											<StatusTooltip color={item.cor} hint={true} />
										</td>
									</div>
									<div id="desc-legenda-cargas">
										<td>
											<p>{item.descricao}</p>
										</td>
									</div>
								</div>
							))}
						</Card.Body>
					</Card>
				</>
			</Modal.Body>
			<Modal.Footer id="modal-footer">
				<Button id="button-sair" onClick={props.onHide}>
					Sair
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
