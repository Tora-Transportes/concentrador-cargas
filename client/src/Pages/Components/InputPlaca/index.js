import React, { useState, useRef } from "react";
import {
	InputGroup,
	Button,
	FormControl,
	Modal,
	Card,
	ListGroup,
	ListGroupItem,
} from "react-bootstrap";
import ServiceVeiculos from "src/services/ServiceVeiculos";

function InputPlaca(props) {
	const [veiculo, setVeiculo] = useState(null);
	const placaInput = useRef(null);

	async function handleSearchVehicle() {
		const placa = (placaInput.current?.value || "").toUpperCase().trim();
		if (!placa) {
			setVeiculo(null);
		} else {
			const v = (await ServiceVeiculos.get(placa)).data.data;
			setVeiculo(v);
		}
	}

	return (
		<>
			<InputGroup className="mb-2">
				<InputGroup.Text>
					<Button variant="" onClick={handleSearchVehicle}>
						Placa 🔎
					</Button>
				</InputGroup.Text>
				<FormControl
					ref={placaInput}
					placeholder="Placa veículo"
					type="text"
					name="placa_veiculo"
					{...props}
				/>
			</InputGroup>
			<Modal show={veiculo !== null} onHide={() => setVeiculo(null)}>
				<Modal.Header closeButton>
					<Modal.Title>Dados do veículo</Modal.Title>
				</Modal.Header>
				{veiculo && (
					<Card>
						<ListGroup className="list-group-flush">
							<ListGroupItem>
								<b>ID</b>: {veiculo.id_veiculo}
							</ListGroupItem>
							<ListGroupItem>
								<b>Descrição</b>: {veiculo.descricao}
							</ListGroupItem>
							<ListGroupItem>
								<b>Ano</b>: {veiculo.ano}
							</ListGroupItem>
							<ListGroupItem>
								<b>Chassis</b>: {veiculo.chassis}
							</ListGroupItem>
							<ListGroupItem>
								<b>Placa</b>: {veiculo.placa}
							</ListGroupItem>
							<ListGroupItem>
								<b>Placa Carreta</b>: {veiculo.placa_carreta}
							</ListGroupItem>
							<ListGroupItem>
								<b>Placa BITREM</b>: {veiculo.placa_bitrem}
							</ListGroupItem>
						</ListGroup>
					</Card>
				)}
			</Modal>
		</>
	);
}

export default InputPlaca;
