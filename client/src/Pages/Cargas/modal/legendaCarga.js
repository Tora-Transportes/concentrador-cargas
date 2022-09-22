import React, { useState, useEffect } from "react";
import "./modal.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ServiceSituacoesCargas from "src/services/ServiceSituacoesCargas";
import StatusTooltip from "src/Pages/Components/StatusTooltip";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";

export default function LegendaCargas(props) {
	const [situacoes, setSituacoes] = useState([]);
	useEffect(() => {
		ServiceSituacoesCargas.search().then(({ data }) => {
			setSituacoes(data.data);
		});
	}, []);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton className="text-center testeteste">
				<Modal.Title id="contained-modal-title-vcenter">
					Situação das Cargas
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<>
					<Card className="text-center">
						<Card.Body className="card-body-legenda">
							{situacoes.map((item) => (
								<Col key={item.id} className="col-legenda">
									<div className="icon-text">
										<StatusTooltip color={item.cor} hint={false} />
									</div>
									<p className="card-p-descricao-legenda">{item.descricao}</p>
								</Col>
							))}
						</Card.Body>
					</Card>
				</>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Sair</Button>
			</Modal.Footer>
		</Modal>
	);
}
