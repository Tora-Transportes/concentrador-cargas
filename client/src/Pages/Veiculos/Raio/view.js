import React from "react";
import { Container, Row, Form, Button, Table, Card } from "react-bootstrap";
// import "./../styleVeiculos.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BsDownload } from "react-icons/bs";
import "./style.css";
import L from "leaflet";

const originIcon = L.icon({
	iconUrl:
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAM7SURBVFhHtZdbTxNBFMdnt7NbewloJAhKaTFKSmuEBK+JxPjiqx/CF9/9Nn4LH/XNaOI1ATRFg0ZKC9RyqXJZSvcy65nlULrs7AUov5c9/9ntnPnPzJ7ZSiQC60PXXhoxet6S5Iu2JKUl296J2eyvYpmNvqVfT/AxXwKTLOcKM9BhXrWMODZ5gOQGJJ8fKs/dwCYPMl5d3Hn+QoYEWtzUx4MScMCNcs7Uiyu5sSb/HTa78DiBzr9A55Moj02LqrNXynMTKB1cSaojxUrCaGVQnpimEq9lFkqXUR5OVy2bf9ONBBzoZ3AlO/Ye5WGSGGNTGHYFhZl3MdxPAtO0Ktss0naOCuxKCfptOHF9ePQVuHjs3DkDLFl+Lesx5SrqQFiMEiufJ/TRQ2IVi8RSVbwTDO9fquYKmwlT78E2IUYqTQZ+TKM6pDZ+j6iNDVRimlTdkhVmpVH7krx/GyM36Vuu10EI71+CumSjFmJRSvoXvqPyUr9+k9C9JioxwjLQiS3HMBJjy6FdEBmKW6ATqrfI9tNnqLwouxpGYnj/sLtosFdg52sJIzf1qfCdD/3vShWoV8kI5cTo6SWJyQkiK5TYjBFt+htRN9bxrj+aEq9IK9n8W9UyH2Bb1wEn75xSUs+MMjjpulpWOHw9LlXn97fGHlVqTmuXgX6X+dVJAm/8LL92G1hrp0y0p6iSK+wkTT2F8tTsUvXfcHnuAo/bbxK1mbc4nQIoJzMYHjl+c2NawjSSKE8MuNDARbsmumoCZewThqdCZWb76OV4ti2szTasTWhl9gNcbIGLXpQOnuoGo/iA4YmA33tmQ/gCgptNcBN4kIno3FGdeJxw4pZ7TqMCv/uIoQvfUrKYKzRSpu4ZlR8ajW9ky6U+lC6ETjgJyzjW2iQs3Xdn+jrhLI4U11JGSzi6TqCcr2UXSv0oPfg64UDtibQ28Fyg60AnHHBTAzcDKD2Aiz/gYhClkEAnHBjlZwyFhN3nhDrhgJtlcNP+K3AAuFgCF6FHd6Qk8OEjrWZGLRk+orGBMEmy+6s/Q2eCE+khGIsNn5sVFA5HdRARnexz8C1wcHZjcyiRH+TsxejvzuuZwYsnhhEh5D/Q1jOL500R5AAAAABJRU5ErkJggg==",
	iconSize: new L.Point(40, 60),
});

const truckIcon = L.icon({
	iconUrl:
		"data:image/png;base64,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",
	iconSize: new L.Point(40, 40),
});

function ViewRotasPendentes({ buscarVeiculosNoRaio, raio, clearRaio }) {
	const [fields, setFields] = React.useState({
		placa: "",
		distancia_km: 50,
	});

	function handleChange(event) {
		const { name, value } = event.target;
		setFields((prevState) => ({ ...prevState, [name]: value }));
	}

	React.useEffect(() => {
		clearRaio();
	}, [fields.placa, fields.distancia_km]);

	function handleSubmit(event) {
		event.preventDefault();
		buscarVeiculosNoRaio(fields.placa, fields.distancia_km);
	}

	function exportCsv() {
		let csv =
			"placa_origem;latitude_origem;longitude_origem\n" +
			`${raio.placa};${raio.latitude_origem};${raio.longitude_origem}\n\n` +
			"placa;latitude;longitude;data_hora;distancia_km\n";

		for (const v of raio.veiculos) {
			const data =
				v.data_alteracao.split("T")[0].split("-").reverse().join("/") +
				" " +
				v.data_alteracao.split("T")[1].split(".")[0];
			csv += `${v.placa};${v.latitude};${v.longitude};${data};${v.distancia_km}\n`;
		}
		const csvData = new Blob([csv], {
			type: "text/csv;charset=utf-8;",
		});
		const csvURL = URL.createObjectURL(csvData);
		const tempLink = document.createElement("a");
		tempLink.href = csvURL;
		tempLink.setAttribute("download", "raio.csv");
		tempLink.click();
	}

	return (
		<div className="class-body">
			<Container className="text-center mb-5 mt-4">
				{raio && (
					<MapContainer
						center={[raio.latitude_origem, raio.longitude_origem]}
						zoom={11}
						style={{ height: "80vh" }}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						{raio.veiculos.map((v, index) => {
							return (
								<Marker
									key={v.placa + index}
									position={[v.latitude, v.longitude]}
									icon={v.placa === fields.placa ? originIcon : truckIcon}
								>
									<Popup>
										{v.placa} está a {Number(v.distancia_km).toFixed(2)} KM da
										origem.
									</Popup>
								</Marker>
							);
						})}
					</MapContainer>
				)}
				<Row>
					<h1 className="class-title-raio mt-4">Veículos Próximos</h1>

					<div>
						<Card className="class-card-raio">
							<Form onSubmit={handleSubmit} className="class-body-viewraio">
								<Form.Group controlId="formPlaca">
									<Form.Label>Placa</Form.Label>
									<Form.Control
										className="form-placa-veic"
										type="text"
										name="placa"
										value={fields.placa}
										onChange={handleChange}
										required
									/>
								</Form.Group>

								<Form.Group controlId="formdistancia">
									<Form.Label>Distância (KM)</Form.Label>
									<Form.Control
										className="form-distancia-veic"
										type="number"
										min="1"
										name="distancia_km"
										value={fields.distancia_km}
										onChange={handleChange}
										required
									/>
								</Form.Group>

								<Button type="submit" id="button-pesq-veic-prox">
									Pesquisar
								</Button>
							</Form>
						</Card>
					</div>
				</Row>

				<Row>
					{raio && (
						<Table className="mt-5" striped bordered hover>
							<thead>
								<tr>
									<th>
										<Button variant="outline-info" onClick={exportCsv}>
											<BsDownload />
										</Button>
									</th>
									<th>Distância KM</th>
									<th>Placa</th>
									<th>Latitude</th>
									<th>Longitude</th>
								</tr>
							</thead>
							<tbody>
								{raio.veiculos.map((v, index) => (
									<tr key={v.placa}>
										<td>{index}</td>
										<td>{Number(v.distancia_km).toFixed(2)}</td>
										<td>
											{v.placa === fields.placa ? <b>{v.placa}</b> : v.placa}
										</td>
										<td>{v.latitude}</td>
										<td>{v.longitude}</td>
									</tr>
								))}
							</tbody>
						</Table>
					)}
				</Row>
			</Container>
		</div>
	);
}

export default ViewRotasPendentes;
