import React, { useRef, useEffect } from "react";
import {
	InputGroup,
	// Button,
	FormControl,
	// Modal,
	// Card,
	// ListGroup,
	// ListGroupItem,
} from "react-bootstrap";
// import ServiceVeiculos from "src/services/ServiceVeiculos";

function InputPlaca(props) {
	// const [veiculo, setVeiculo] = useState(null);
	const placaInput = useRef(null);

	// async function handleSearchVehicle(placaPesquisa = "") {
	// 	const placa = (placaPesquisa || "").toUpperCase().trim();
	// 	if (!placa) {
	// 		setVeiculo(null);
	// 	} else {
	// 		const v = (await ServiceVeiculos.get(placa)).data.data;
	// 		setVeiculo(v);
	// 	}
	// }

	useEffect(() => {
		const handleUpperCase = (e) => {
			e.target.value = e.target.value.toUpperCase();
		};
		placaInput.current.addEventListener("keyup", handleUpperCase);
		return () => {
			placaInput.current.removeEventListener("keyup", handleUpperCase);
		};
	}, []);

	return (
		<>
			<InputGroup className="mb-2">
				<InputGroup.Text className="p-3">Placa Cavalo 🐴</InputGroup.Text>
				<FormControl
					ref={placaInput}
					placeholder="Placa veículo"
					type="text"
					name="placa_veiculo"
					{...props}
				/>
			</InputGroup>

			{/* {placas && (
				<Row>
					<Col sm={12} md={6}>
						<InputGroup className="mb-2">
							<InputGroup.Text>
								<Button
									variant=""
									onClick={() => handleSearchVehicle(placas?.carreta)}
								>
									Carreta 🚛
								</Button>
							</InputGroup.Text>
							<FormControl
								readOnly
								placeholder="Placa Carreta"
								type="text"
								value={placas?.carreta || ""}
							/>
						</InputGroup>
					</Col>
					<Col>
						<InputGroup className="mb-2">
							<InputGroup.Text>
								<Button
									variant=""
									onClick={() => handleSearchVehicle(placas?.bitrem)}
								>
									Bitrem 🚛
								</Button>
							</InputGroup.Text>
							<FormControl
								readOnly
								placeholder="Placa Bitrem"
								type="text"
								value={placas?.bitrem || ""}
							/>
						</InputGroup>
					</Col>
				</Row>
			)} */}
			{/* <Modal show={veiculo !== null} onHide={() => setVeiculo(null)}>
				<Modal.Header closeButton>
					<Modal.Title>Dados do veículo</Modal.Title>
				</Modal.Header>
				{veiculo && (
					<Card>
						<ListGroup className="list-group-flush">
							<ListGroupItem>
								<b>Código do veículo</b>: {veiculo.id_veiculo}
							</ListGroupItem>
							<ListGroupItem>
								<b>Motorista</b>: {veiculo.nome_motorista}
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
			</Modal> */}
		</>
	);
}

export default InputPlaca;
