import React, { useState, useEffect } from "react";
import "../coordenadas.css";
import ServiceCoordenadas from "src/services/ServiceCoordenadas";
import { Col, Row } from "react-bootstrap";
import useLoadingScreen from "../../Components/LoadingScreen";
import swal from "sweetalert";
import { Card } from "primereact/card";
import DateUtils from "../../Utils/date";

function LastLocationVeicles({ placa, setVisibleLastLocation }) {
	const [dadosLastLocation, setDadosLastLocation] = useState({});
	const [LoadingScreen, setLoading] = useLoadingScreen();

	useEffect(() => {
		(async () => {
			setLoading(true);
			const { data } = await ServiceCoordenadas.searchLastPosition(placa);
			if (data) {
				setDadosLastLocation(data);
				setLoading(false);
			} else {
				const exitDialog = swal(
					"Ops!",
					"Não foram encontrados dados da última localização.",
					"warning"
				);
				if (exitDialog) setVisibleLastLocation(false);

				setLoading(false);
			}
		})();
	}, []);

	return (
		<>
			<LoadingScreen />
			<Row>
				<Col className="p-2">
					<ul className="ul_last-location">
						<Card className="card-dados-last-location">
							<li className="class-li-last-location">
								<h6>
									Data:{" "}
									<strong>
										{DateUtils.formatDate(dadosLastLocation?.DTINC)}
									</strong>
								</h6>
							</li>
							<li>
								<h6>
									UF: <strong>{dadosLastLocation?.UF}</strong>
								</h6>
							</li>
							<li>
								<h6>
									Municipio: <strong>{dadosLastLocation?.MUN}</strong>
								</h6>
							</li>
							<li>
								<h6>
									Latitude: <strong>{dadosLastLocation?.LAT}</strong>
								</h6>
							</li>
							<li>
								<h6>
									Longitude: <strong>{dadosLastLocation?.LON}</strong>
								</h6>
							</li>
							{/* <li >
									<h6>
										Localidade: <strong>{dadosLastLocation?.LOC}</strong>
									</h6>
								</li> */}
							<li>
								<h6>
									Placa: <strong>{placa}</strong>
								</h6>
							</li>
						</Card>
					</ul>
				</Col>
			</Row>
		</>
	);
}

export default LastLocationVeicles;
