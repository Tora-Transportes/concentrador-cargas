import React from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Table,
	Card,
} from "react-bootstrap";
import iconStart from "../../../assets/start.png";
import iconFinish from "../../../assets/finish.png";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { BsDownload } from "react-icons/bs";
import DateUtils from "../../Utils/date";
import "./historicoVeiculos.css";

const utf8 = require("utf8");
const truckIcon = L.icon({
	iconUrl:
		"data:image/png;base64,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",
	iconSize: new L.Point(40, 40),
});

const startIcons = L.icon({
	iconUrl: iconStart,
	iconSize: new L.Point(52, 52),
});

const finishIcons = L.icon({
	iconUrl: iconFinish,
	iconSize: new L.Point(52, 52),
});

function ViewHistoricoVeiculo({
	buscarHistoricoVeicles,
	historicoRotas,
	clearHistoricoRotas,
	LoadingScreen,
	setLoading,
}) {
	const [fields, setFields] = React.useState({
		placa: "",
		date_inicio: new Date(),
		date_fim: new Date(),
	});

	function handleChange(event) {
		const { name, value } = event.target;
		setFields((prevState) => ({ ...prevState, [name]: value }));
	}

	React.useEffect(() => {
		clearHistoricoRotas();
	}, [fields.placa, fields.date_inicio, fields.date_fim]);

	function handleSubmit(event) {
		event.preventDefault();
		buscarHistoricoVeicles(fields.placa, fields.date_inicio, fields.date_fim);
	}

	function exportCsv() {
		setLoading(true);
		let csv = "\ufeff" + utf8 + csv;
		for (const position of historicoRotas.posicao) {
			const message = "sem dados";
			const UF = position.UF == null ? message : position.UF;
			const MUN = position.MUN == null ? message : position.MUN;
			const RUA = position.RUA == null ? message : position.RUA;
			csv += `${UF};${MUN};${RUA};${position.LAT};${position.LON};${
				position.LOC
			};${DateUtils.formatDate(position.DTINC)}\n`;
		}

		const csvData = new Blob([csv], {
			type: "text/csv;charset=utf-8,/uFEFF;",
		});

		const csvURL = window.URL.createObjectURL(csvData);
		const tempLink = document.createElement("a");
		tempLink.href = csvURL;
		tempLink.setAttribute("download", "Historico-de-Rotas.csv");
		tempLink.click();
		setLoading(false);
	}

	return (
		<div className="body-hist-veic">
			<LoadingScreen />
			<Container className="text-center">
				<Row id="title-hist-veic">
					<h1>Histórico de rotas do veículo</h1>
				</Row>
				<Form onSubmit={handleSubmit}>
					<Card className="mt-5">
						<Row className="row-input-history">
							<Col lg={4} sm={12}>
								<Form.Group controlId="formPlaca">
									<Form.Label>Placa</Form.Label>
									<Form.Control
										className="ms-2"
										type="text"
										name="placa"
										value={fields.placa}
										onChange={handleChange}
										required
									/>
								</Form.Group>
							</Col>
							<Col lg={4} sm={12}>
								<Form.Group controlId="formdistancia">
									<Form.Label>Data início</Form.Label>
									<Form.Control
										className="ms-2"
										type="date"
										name="date_inicio"
										onChange={handleChange}
										required
									/>
								</Form.Group>
							</Col>
							<Col lg={4} sm={12}>
								<Form.Group controlId="formdistancia">
									<Form.Label>Data fim</Form.Label>
									<Form.Control
										className="ms-2"
										type="date"
										name="date_fim"
										onChange={handleChange}
										required
									/>
								</Form.Group>
							</Col>
						</Row>
					</Card>
					<Button type="submit" id="button-pesq-history">
						Pesquisar
					</Button>
				</Form>
				<Row className="mt-3">
					{historicoRotas?.posicao.length > 0 && (
						<>
							<MapContainer
								center={[
									historicoRotas?.posicao[0].LAT.replace(",", "."),
									historicoRotas?.posicao[0].LON.replace(",", "."),
								]}
								zoom={11}
								style={{ height: "80vh" }}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>

								{historicoRotas.posicao.map((position, index) => {
									const lastPosition = historicoRotas.posicao.length - 1;
									const messagePopup =
										index === 0
											? " Posição inicial da busca"
											: index === lastPosition
											? "Posição final da busca"
											: `UF: ${position.UF?.toUpperCase()} ,Municipio: ${position.MUN?.toUpperCase()} ,Rua: ${position.RUA?.toUpperCase()}.`;
									return (
										<Marker
											key={fields.placa + index}
											position={[
												position.LAT.replace(",", "."),
												position.LON.replace(",", "."),
											]}
											icon={
												index === 0
													? startIcons
													: index === lastPosition
													? finishIcons
													: truckIcon
											}
										>
											<Popup>{messagePopup}</Popup>
										</Marker>
									);
								})}
							</MapContainer>
							<strong className="placa-consultada">
								{" "}
								Placa correspondente a consulta:
								<span className="span-placa"> {fields.placa}</span>
							</strong>
							<Table className="mt-5" striped bordered hover>
								<thead>
									<tr>
										<th>
											<Button variant="outline-info" onClick={exportCsv}>
												<BsDownload />
											</Button>
										</th>
										<th>Placa Veículo</th>
										<th>UF</th>
										<th>Municipio</th>
										<th>Rua</th>
										<th>Rodovia</th>
										<th>Latitude</th>
										<th>Longitude</th>
										<th>Localidade</th>
										<th>Data Posição</th>
									</tr>
								</thead>
								<tbody>
									{historicoRotas.posicao.map((position, index) => (
										<tr key={index + 1}>
											<td>{index}</td>
											<td>{fields.placa}</td>
											<td>{position.UF}</td>
											<td>{position.MUN}</td>
											<td>{position.RUA}</td>
											<td>{position.ROD}</td>
											<td>{position.LAT}</td>
											<td>{position.LON}</td>
											<td>{position.LOC}</td>
											<td>{DateUtils.formatDate(position.DTINC)}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</>
					)}
				</Row>
			</Container>
		</div>
	);
}

export default ViewHistoricoVeiculo;
