import React, { useState } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Table,
	Accordion,
	Button,
	Modal,
	InputGroup,
} from "react-bootstrap";
import { BsGear } from "react-icons/bs";
// import NavbarNavigator from "../Components/NavbarNavigator";
import swal from "sweetalert";
import ServiceRelatorios from "src/services/ServiceRelatorios";
import useLoadingScreen from "../Components/LoadingScreen";
import caminhaoImg from "../../assets/caminhao.gif";
import Menusuperior from "../Components/MenuSuperior/menusuperior";

export default function CalendarioProducao() {
	const [events, setEvents] = useState({});
	const [show, setShow] = useState(false);
	const [Loading, setLoading] = useLoadingScreen();
	const [placa, setPlaca] = useState("");
	const [form, setForm] = useState({
		data_inicio: null,
		data_final: null,
		observacao: null,
	});
	const [codigoVeiculo, setCodigoVeiculo] = useState(null);
	const [jsx, setJsx] = useState(null);

	function handleForm(event) {
		const { name, value } = event.target;
		setForm({ ...form, [name]: value });
	}
	function resetForm() {
		const limpo = {};
		for (const i in form) {
			limpo[i] = null;
		}
		setForm(limpo);
	}

	/*
	{
		"ano": {
			"mes": {
				"dia1": [],
				"dia2": [],
			}
		}
	}


	{
		"CODIGO_VEICULO": "13213213213",
		"EVENTOS": [
			{
				"RANK": 1,
				"EVENTO": "DOCUMENTO RPA",
				"CONTEUDO": "089862000",
				"ORIGEM": "CONTAGEM - MG",
				"DESTINO": "TIMOTEO - MG",
				"DATA_INICIO": "2021-05-17T03:00:00.000Z",
				"DATA_FINAL": "2021-05-18T06:32:09.600Z"
			},
			{
				"RANK": 1,
				"EVENTO": "DOCUMENTO DVF",
				"CONTEUDO": "089862465",
				"ORIGEM": "CONTAGEM - MG",
				"DESTINO": "TIMOTEO - MG",
				"DATA_INICIO": "2021-05-17T03:00:00.000Z",
				"DATA_FINAL": "2021-05-18T06:32:09.600Z"
			},
			{
				"RANK": 2,
				"EVENTO": "JUSTIFICATIVA",
				"CONTEUDO": "O USUÁRIO NÃO POSSUI JUSTIFICATIVA",
				"ORIGEM": null,
				"DESTINO": null,
				"DATA_INICIO": "2021-05-19T03:00:00.000Z",
				"DATA_FINAL": "2021-05-25T06:32:09.600Z"
			}
		]
	}

	*/

	function calcularPercentualTrabalho(ano) {
		let diasTrabalhados = 0;
		let diasAno = 0;
		for (const mes in events[ano]) {
			for (const dia in events[ano][mes]) {
				diasAno += 1;
				for (const j of events[ano][mes][dia]) {
					if (j.EVENTO === "DOCUMENTO RPA" || j.EVENTO === "DOCUMENTO DVF") {
						diasTrabalhados += 1;
						break;
					}
				}
			}
		}

		return { ano, diasTrabalhados, diasAno };
	}

	async function handleSearch(event) {
		event.preventDefault();
		if (placa.length < 7) {
			setPlaca("");
			setEvents({});
			setCodigoVeiculo(null);
			return swal("Ops!", "Placa inválida", "warning");
		}

		setLoading(true);
		let data;
		try {
			data = (await ServiceRelatorios.producaoVeiculo(placa)).data.data;
		} catch (error) {
			setEvents({});
			setCodigoVeiculo(null);
			setLoading(false);
			return;
		}
		setLoading(false);

		setCodigoVeiculo(data.CODIGO_VEICULO);
		const structuredEvents = {};
		for (const i of data.EVENTOS) {
			const ano_origem = i.DATA_INICIO.substring(0, 4);
			const ano_destino = i.DATA_FINAL ? i.DATA_FINAL.substring(0, 4) : null;

			if (ano_origem && !structuredEvents[ano_origem]) {
				structuredEvents[ano_origem] = {};
				for (let j = 1; j <= 12; j++) {
					const chaveMes = j < 10 ? `0${j}` : j;
					structuredEvents[ano_origem][chaveMes] = {};
					for (let k = 1; k <= 31; k++) {
						const chaveDia = k < 10 ? `0${k}` : k;
						structuredEvents[ano_origem][chaveMes][chaveDia] = [];
					}
				}
			}
			if (ano_destino && !structuredEvents[ano_destino]) {
				structuredEvents[ano_destino] = {};

				for (let j = 1; j <= 12; j++) {
					const chaveMes = j < 10 ? `0${j}` : j;
					structuredEvents[ano_destino][chaveMes] = {};
					for (let k = 1; k <= 31; k++) {
						const chaveDia = k < 10 ? `0${k}` : k;
						structuredEvents[ano_destino][chaveMes][chaveDia] = [];
					}
				}
			}

			const mes_origem = i.DATA_INICIO.substring(5, 7);
			const dia_origem = i.DATA_INICIO.substring(8, 10);

			const evento = {
				...i,
				CODIGO_VEICULO: data.CODIGO_VEICULO,
			};
			structuredEvents[ano_origem][mes_origem][dia_origem].push(evento);
			if (i.DATA_FINAL !== null) {
				const data_inicio = new Date(i.DATA_INICIO.split("T")[0]);
				data_inicio.setDate(data_inicio.getDate() + 1);
				while (
					data_inicio.toISOString().split("T")[0] <= i.DATA_FINAL.split("T")[0]
				) {
					const ano = data_inicio.getFullYear();
					const mes = data_inicio.toISOString().substring(5, 7);
					const dia = data_inicio.toISOString().substring(8, 10);

					structuredEvents[ano][mes][dia].push(evento);

					data_inicio.setDate(data_inicio.getDate() + 1);
				}
			}
		}

		setEvents(structuredEvents);
	}

	function onHide() {
		setShow(false);
		resetForm();
	}

	async function handleAddObservacao(event) {
		event.preventDefault();
		if (!codigoVeiculo) {
			return swal("Ops!", "Nenhum veículo foi selecionado", "warning");
		}
		const evento = {
			EVENTO: "JUSTIFICATIVA",
			CONTEUDO: form.observacao,
			ORIGEM: null,
			DESTINO: null,
			DATA_INICIO: form.data_inicio + "T00:00:00.000Z",
			DATA_FINAL: form.data_final + "T00:00:00.000Z",
			RANK: 1,
		};

		const eventoApi = {
			codigo_veiculo: codigoVeiculo,
			data_inicio: new Date(form.data_inicio + "T00:00:00"),
			data_final: new Date(form.data_final + "T00:00:00"),
			conteudo: form.observacao,
		};

		try {
			await ServiceRelatorios.criarEventoProducao(eventoApi);
		} catch (error) {
			return;
		}

		const data_inicio = new Date(form.data_inicio + "T00:00:00");
		const ano = data_inicio.getFullYear();

		let mes = data_inicio.getMonth() + 1;
		mes = mes < 10 ? `0${mes}` : String(mes);

		let dia = data_inicio.getDate();
		dia = dia < 10 ? `0${dia}` : String(dia);

		const structuredEvents = { ...events };

		if (ano && !structuredEvents[ano]) {
			structuredEvents[ano] = {};
			for (let j = 1; j <= 12; j++) {
				const chaveMes = j < 10 ? `0${j}` : j;
				structuredEvents[ano][chaveMes] = {};
				for (let k = 1; k <= 31; k++) {
					const chaveDia = k < 10 ? `0${k}` : k;
					structuredEvents[ano][chaveMes][chaveDia] = [];
				}
			}
		}

		structuredEvents[ano][mes][dia].push(evento);

		data_inicio.setDate(data_inicio.getDate() + 1);
		while (data_inicio.toISOString().split("T")[0] <= form.data_final) {
			const ano = data_inicio.getFullYear();

			let mes = data_inicio.getMonth() + 1;
			mes = mes < 10 ? `0${mes}` : String(mes);

			let dia = data_inicio.getDate();
			dia = dia < 10 ? `0${dia}` : String(dia);

			structuredEvents[ano][mes][dia].push(evento);

			data_inicio.setDate(data_inicio.getDate() + 1);
		}

		setEvents(structuredEvents);
		setShow(false);
		resetForm();
	}

	function padding(element, size) {
		const output = String(element).substring(0, size).padStart(size, "0");
		return output;
	}

	function formatarData(data) {
		if (!data) return "";
		return String(data).split("T")[0].split("-").reverse().join("/");
	}

	function mostrarEventos(ano, mes, dia) {
		const eventos = events[ano][padding(mes, 2)][padding(dia, 2)];
		if (eventos.length === 0) {
			return null;
		}
		return (
			<div className="eventos-dia">
				{eventos.map((evento, index) => {
					return (
						<div key={index} className="border p-3">
							<div>
								<b>CONTEUDO</b>: {evento.CONTEUDO}
							</div>
							<div>
								<b>EVENTO</b>: {evento.EVENTO}
							</div>
							<div>
								<b>DATA_INICIO</b>: {formatarData(evento.DATA_INICIO)}
							</div>
							<div>
								<b>DATA_FINAL</b>: {formatarData(evento.DATA_FINAL)}
							</div>
							{evento.ORIGEM && (
								<div>
									<b>ORIGEM</b>: {evento.ORIGEM}
								</div>
							)}
							{evento.DESTINO && (
								<div>
									<b>DESTINO</b>: {evento.DESTINO}
								</div>
							)}
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<>
			<Loading />
			<Menusuperior />
			<Container>
				<Row className="mt-3 mb-3">
					<Form onSubmit={handleSearch}>
						<Col sm={12} md={6}>
							<InputGroup>
								<Form.Control
									type="text"
									placeholder="PLACA DO VEICULO (AAA8778)"
									value={placa}
									onChange={(event) =>
										setPlaca(event.target.value.toUpperCase().substring(0, 7))
									}
								/>
								<Button type="submit">🔍</Button>
							</InputGroup>
						</Col>
						{codigoVeiculo && (
							<Button
								variant="outline-info"
								onClick={() => setShow((old) => !old)}
							>
								<BsGear />
							</Button>
						)}
					</Form>
				</Row>

				{Object.keys(events).length === 0 && (
					<Row className="mt-5 p-5">
						<p className="font-monospace">
							Nessa tela consulte a produção de uma placa específica
						</p>
						<img
							src={caminhaoImg}
							alt="caminhao verde"
							style={{ maxWidth: "800px" }}
						/>
					</Row>
				)}

				<Accordion className="mb-5">
					{Object.keys(events)
						.sort((a, b) => Number(b) - Number(a))
						.map((ano) => {
							const { diasAno, diasTrabalhados } =
								calcularPercentualTrabalho(ano);
							return (
								<Accordion.Item eventKey={ano} key={ano}>
									<Accordion.Header>
										Em <b>{`"${ano}"`}</b>
										{" esse veículo trabalhou " +
											((diasTrabalhados / diasAno) * 100).toFixed(2) +
											"% dos dias"}
									</Accordion.Header>
									<Accordion.Body>
										<Row>
											<h1 className="h2">ANO {ano}</h1>
											<Col>
												<div
													style={{
														width: "100%",
														overflowX: "scroll",
													}}
												>
													<Table className="text-center">
														<thead>
															<tr>
																<th>MÊS</th>
																<th colSpan={31}>DIAS</th>
															</tr>
														</thead>
														<tbody>
															{Object.keys(events[ano])
																.sort((a, b) => Number(a) - Number(b))
																.map((mes) => (
																	<tr key={ano + mes}>
																		<td className="bg-secondary">{mes}</td>
																		{Array.from("0".repeat(31)).map(
																			(i, index) => (
																				<td
																					onClick={() =>
																						setJsx(
																							mostrarEventos(
																								ano,
																								mes,
																								index + 1
																							)
																						)
																					}
																					key={index}
																					className={
																						events[ano][mes][
																							index + 1 < 10
																								? "0" + (index + 1)
																								: index + 1
																						].length > 0
																							? events[ano][mes][
																									index + 1 < 10
																										? "0" + (index + 1)
																										: index + 1
																							  ][0].EVENTO === "JUSTIFICATIVA"
																								? "bg-warning"
																								: "bg-success"
																							: new Date(
																									ano,
																									mes,
																									0
																							  ).getDate() <
																							  index + 1
																							? "bg-white text-white"
																							: ""
																					}
																				>
																					{index + 1 < 10
																						? `0${index + 1}`
																						: index + 1}
																				</td>
																			)
																		)}
																	</tr>
																))}
														</tbody>
													</Table>
												</div>
											</Col>
										</Row>
									</Accordion.Body>
								</Accordion.Item>
							);
						})}
				</Accordion>

				<Modal show={show} onHide={onHide}>
					<Form onSubmit={handleAddObservacao}>
						<Modal.Header closeButton>
							<Modal.Title>Cadastrar JUSTIFICATIVA</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form.Group className="mb-3" controlId="id_data_inicio">
								<Form.Label>Data inicial</Form.Label>
								<Form.Control
									type="date"
									name="data_inicio"
									onChange={handleForm}
									value={form.data_inicio}
									required
								/>
							</Form.Group>
							{form.data_inicio && (
								<>
									<Form.Group className="mb-3" controlId="id_data_final">
										<Form.Label>Data final</Form.Label>
										<Form.Control
											type="date"
											name="data_final"
											onChange={handleForm}
											value={form.data_final}
											min={form.data_inicio}
											defaultValue={form.data_inicio}
											required
										/>
									</Form.Group>
									{form.data_final && (
										<Form.Group className="mb-3" controlId="id_observacao">
											<Form.Label>Observações</Form.Label>
											<Form.Control
												as="textarea"
												type="text"
												name="observacao"
												onChange={handleForm}
												value={form.observacao}
												required
											/>
										</Form.Group>
									)}
								</>
							)}
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={onHide}>
								Sair
							</Button>
							<Button variant="primary" type="submit">
								Confirmar
							</Button>
						</Modal.Footer>
					</Form>
				</Modal>

				<Modal show={jsx} onHide={() => setJsx(null)}>
					<Modal.Header closeButton>
						<Modal.Title>Detalhes Evento</Modal.Title>
					</Modal.Header>
					<Modal.Body>{jsx}</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setJsx(null)}>
							Sair
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		</>
	);
}
