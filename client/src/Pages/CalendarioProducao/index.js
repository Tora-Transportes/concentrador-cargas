import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import NavbarNavigator from "../Components/NavbarNavigator";
import Calendar from "react-awesome-calendar";
import swal from "sweetalert";
import ServiceRelatorios from "src/services/ServiceRelatorios";
import useLoadingScreen from "../Components/LoadingScreen";
export default function CalendarioProducao() {
	const [events, setEvents] = useState([]);
	const [Loading, setLoading] = useLoadingScreen();

	// [
	// 	{
	// 		id: 1,
	// 		color: "#fd3153",
	// 		from: "2022-04-02T18:00:00+00:00",
	// 		to: "2022-04-05T19:00:00+00:00",
	// 		title: "This is an event",
	// 	},
	// 	{
	// 		id: 2,
	// 		color: "#1ccb9e",
	// 		from: "2022-04-01T13:00:00+00:00",
	// 		to: "2022-04-05T14:00:00+00:00",
	// 		title: "This is another event",
	// 	},
	// 	{
	// 		id: 3,
	// 		color: "#3694DF",
	// 		from: "2022-04-05T13:00:00+00:00",
	// 		to: "2022-04-05T20:00:00+00:00",
	// 		title: "This is also another event",
	// 	},
	// ];

	async function handleSearch(event) {
		const placa = event.target.value.toUpperCase().substring(0, 7);
		event.target.value = placa;

		if (placa.length < 7) {
			event.target.value = "";
			return swal("Ops! 👀", "Placa inválida", "warning");
		}

		setLoading(true);
		const { data } = await ServiceRelatorios.producaoVeiculo(placa);
		setLoading(false);
		const dataToEvents = data.data.map((i, index) => ({
			id: index + 1,
			color: "#1ccb9e",
			from: i.DT_EMISSAO.split(".")[0] + "+00:00",
			to: i.PREVISAO_CHEGADA.split(".")[0] + "+00:00",
			title: `${i.NUM_DOC} - DE: ${i.ORIGEM} ATÉ ${i.DESTINO}`,
		}));
		setEvents(dataToEvents);
	}

	return (
		<>
			<Loading />
			<NavbarNavigator />
			<Container>
				<Row className="mt-3">
					<Form>
						<Col sm={12} md={6}>
							<Form.Control
								type="text"
								placeholder="PLACA DO VEICULO (AAA8778)"
								onBlur={handleSearch}
							/>
						</Col>
					</Form>
				</Row>
				<Row>
					<Col>
						<Calendar
							events={events}
							onEventClick={(event) => alert(event.title)}
						/>
					</Col>
				</Row>
			</Container>
		</>
	);
}
