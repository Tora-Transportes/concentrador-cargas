import React, { useState } from "react";
import InputMask from "react-input-mask";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Card,
	Accordion,
	ProgressBar,
	Table,
	Badge,
} from "react-bootstrap";
import useLoadingScreen from "../../Components/LoadingScreen";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import ServicePPO from "src/services/ServicePPO";
import swal2 from "sweetalert2";
import { formatDateTimeZone } from "../../Utils/formatDate";

const Estatisticas = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [randomValue, setRandomValue] = useState({
		load1: 0,
		load2: 0,
		load3: 0,
		load4: 0,
	});
	const [hasdata, setHasData] = useState({
		avaliacoes: 2,
		distancia: 2,
		infracoes: 2,
		interjornada: 2,
	});
	const [avaliacoes, setAvaliacoes] = useState([]);
	const [distancia, setDistancia] = useState([]);
	const [infracoes, setInfracoes] = useState([]);
	const [interjornada, setInterjornada] = useState([]);
	const [loadBar, setLoadBar] = useState(false);
	const [fields, setFields] = useState({
		cpf: "",
		date_inicio: new Date(),
		date_fim: new Date(),
	});

	function handleChange(event) {
		const { name, value } = event.target;
		setFields((prevState) => ({ ...prevState, [name]: value }));
	}

	async function buscarAvaliacoes(cpf, date_inicio, date_fim) {
		setAvaliacoes([]);
		setLoading(true);
		setLoadBar(true);
		setRandomValue((prevState) => ({ ...prevState, load1: 55 }));
		try {
			const avaliacoes = (
				await ServicePPO.avaliacoes(cpf, date_inicio, date_fim)
			).data;
			if (avaliacoes.data.length > 0) {
				setHasData((prevState) => ({ ...prevState, avaliacoes: 1 }));
				setAvaliacoes(avaliacoes.data);
			} else {
				setHasData((prevState) => ({ ...prevState, avaliacoes: 0 }));
			}
		} catch (error) {
			setRandomValue((prevState) => ({ ...prevState, load1: 100 }));
			setLoading(false);
			setLoadBar(false);
		}
		setRandomValue((prevState) => ({ ...prevState, load1: 100 }));
		setLoading(false);
		setLoadBar(false);
	}

	async function buscarDistancia(cpf, date_inicio, date_fim) {
		setDistancia([]);
		setLoading(true);
		setLoadBar(true);
		setRandomValue((prevState) => ({ ...prevState, load2: 55 }));
		try {
			const distancia = (await ServicePPO.distancia(cpf, date_inicio, date_fim))
				.data;
			if (distancia.data.length > 0) {
				setHasData((prevState) => ({ ...prevState, distancia: 1 }));
				setDistancia(distancia.data);
			} else {
				setHasData((prevState) => ({ ...prevState, distancia: 0 }));
			}
		} catch (error) {
			setRandomValue((prevState) => ({ ...prevState, load2: 100 }));
			setLoading(false);
			setLoadBar(false);
		}
		setRandomValue((prevState) => ({ ...prevState, load2: 100 }));
		setLoading(false);
		setLoadBar(false);
	}

	async function buscarInfracoes(cpf, date_inicio, date_fim) {
		setInfracoes([]);
		setLoading(true);
		setLoadBar(true);
		setRandomValue((prevState) => ({ ...prevState, load3: 55 }));
		try {
			const infracoes = (await ServicePPO.infracoes(cpf, date_inicio, date_fim))
				.data;
			if (infracoes.data.length > 0) {
				setHasData((prevState) => ({ ...prevState, infracoes: 1 }));
				setInfracoes(infracoes.data);
			} else {
				setHasData((prevState) => ({ ...prevState, infracoes: 0 }));
			}
		} catch (error) {
			setRandomValue((prevState) => ({ ...prevState, load3: 100 }));
			setLoading(false);
			setLoadBar(false);
		}
		setRandomValue((prevState) => ({ ...prevState, load3: 100 }));
		setLoading(false);
		setLoadBar(false);
	}

	async function buscarInterjornada(cpf, date_inicio, date_fim) {
		setInterjornada([]);
		setLoading(true);
		setLoadBar(true);
		setRandomValue((prevState) => ({ ...prevState, load4: 55 }));
		try {
			const interjornada = (
				await ServicePPO.interjornadas(cpf, date_inicio, date_fim)
			).data;
			if (interjornada.data.length > 0) {
				setHasData((prevState) => ({ ...prevState, interjornada: 1 }));
				setInterjornada(interjornada.data);
			} else {
				setHasData((prevState) => ({ ...prevState, interjornada: 0 }));
				/* 				await swal2.fire({
					icon: "info",
					title: "Atenção!",
					text: "Interjornadas não encontrada",
				}); */
			}
		} catch (error) {
			setRandomValue((prevState) => ({ ...prevState, load4: 100 }));
			setLoading(false);
			setLoadBar(false);
		}
		setRandomValue((prevState) => ({ ...prevState, load4: 100 }));
		setLoading(false);
		setLoadBar(false);
	}

	function handleSubmit(event) {
		setHasData((prevState) => ({ ...prevState, avaliacoes: 2 }));
		setHasData((prevState) => ({ ...prevState, distancia: 2 }));
		setHasData((prevState) => ({ ...prevState, infracoes: 2 }));
		setHasData((prevState) => ({ ...prevState, interjornada: 2 }));
		event.preventDefault();
		var inicio = new Date(fields.date_inicio);
		var fim = new Date(fields.date_fim);
		var diferencaEmMilissegundos = fim - inicio;
		var diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
		if (diferencaEmDias > 30) {
			swal2.fire({
				icon: "info",
				title: "Atenção!",
				text: "Intervalo entre as data não pode ser maior que 31",
			});
			return;
		}
		buscarAvaliacoes(fields.cpf, fields.date_inicio, fields.date_fim);
		buscarDistancia(fields.cpf, fields.date_inicio, fields.date_fim);
		buscarInfracoes(fields.cpf, fields.date_inicio, fields.date_fim);
		buscarInterjornada(fields.cpf, fields.date_inicio, fields.date_fim);
	}

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="text-center">
				<Row id="title-hist-veic">
					<h1>Estatísticas PPO</h1>
				</Row>
				<Form onSubmit={handleSubmit}>
					<Card className="mt-3">
						<Row className="row-input-history">
							<Col lg={3} sm={12}>
								<Form.Group controlId="formCpf">
									<Form.Label>CPF Motorista</Form.Label>
									<Form.Control
										as={InputMask}
										mask="999.999.999-99"
										className="ms-2"
										type="text"
										name="cpf"
										value={fields.cpf}
										onChange={handleChange}
										required
									/>
								</Form.Group>
							</Col>
							<Col lg={3} sm={12}>
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
							<Col lg={3} sm={12}>
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
							<Col lg={2} sm={12}>
								<Button
									style={{ marginTop: "32px" }}
									type="submit"
									id="button-pesq-history"
								>
									Pesquisar
								</Button>
							</Col>
						</Row>
					</Card>
				</Form>
				<Accordion style={{ marginTop: "20px" }}>
					<Accordion.Item eventKey="0">
						{loadBar ? (
							<ProgressBar variant="success" animated now={randomValue.load1} />
						) : (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "flex-start",
									paddingTop: "5px",
									paddingLeft: "5px",
								}}
							>
								{hasdata.avaliacoes == 1 ? (
									<Badge bg="success">Dados encontrados</Badge>
								) : (
									<></>
								)}
								{hasdata.avaliacoes == 0 ? (
									<Badge bg="danger">Sem informações</Badge>
								) : (
									<></>
								)}
							</div>
						)}
						<Accordion.Header>
							<b>Avaliação Condutor - {avaliacoes.length} </b>
						</Accordion.Header>
						<Accordion.Body>
							{avaliacoes.length > 0 ? (
								<Table>
									<thead>
										<tr>
											<th>Classificação</th>
											<th>Nome Motorista</th>
											<th>CPF</th>
											<th>Pontuação</th>
											<th>Período Inicial</th>
											<th>Período Final</th>
										</tr>
									</thead>
									<tbody>
										{avaliacoes.map((i) => (
											<tr key={i.id}>
												<td>{i.classificacao}</td>
												<td>{i.nome_motorista}</td>
												<td>{i.cpf}</td>
												<td>{i.pontuacao}</td>
												<td>{formatDateTimeZone(i.periodo_inicial)}</td>
												<td>{formatDateTimeZone(i.periodo_final)}</td>
											</tr>
										))}
									</tbody>
								</Table>
							) : (
								<>
									<div> Sem informações...</div>
								</>
							)}
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1" style={{ marginTop: "15px" }}>
						{loadBar ? (
							<ProgressBar variant="success" animated now={randomValue.load2} />
						) : (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "flex-start",
									paddingTop: "5px",
									paddingLeft: "5px",
								}}
							>
								{hasdata.distancia == 1 ? (
									<Badge bg="success">Dados encontrados</Badge>
								) : (
									<></>
								)}
								{hasdata.distancia == 0 ? (
									<Badge bg="danger">Sem informações</Badge>
								) : (
									<></>
								)}
							</div>
						)}
						<Accordion.Header>
							<b>Distância Percorrida - {distancia.length}</b>
						</Accordion.Header>
						<Accordion.Body>
							{distancia.length > 0 ? (
								<Table>
									<thead>
										<tr>
											<th>Nome</th>
											<th>CPF</th>
											<th>Veículo</th>
											<th>Distância</th>
										</tr>
									</thead>
									<tbody>
										{distancia.map((i, idx) => (
											<tr key={idx}>
												<td>{i.nome}</td>
												<td>{i.cpf}</td>
												<td>{i.veiculo}</td>
												<td>{i.distancia}</td>
											</tr>
										))}
									</tbody>
								</Table>
							) : (
								<>
									<div> Sem informações...</div>
								</>
							)}
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2" style={{ marginTop: "15px" }}>
						{loadBar ? (
							<ProgressBar variant="success" animated now={randomValue.load3} />
						) : (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "flex-start",
									paddingTop: "5px",
									paddingLeft: "5px",
								}}
							>
								{hasdata.infracoes == 1 ? (
									<Badge bg="success">Dados encontrados</Badge>
								) : (
									<></>
								)}
								{hasdata.infracoes == 0 ? (
									<Badge bg="danger">Sem informações</Badge>
								) : (
									<></>
								)}
							</div>
						)}
						<Accordion.Header>
							<b>
								Infrações Condutor - {infracoes.length} | Velocidade acima de
								87km/h
							</b>
						</Accordion.Header>
						<Accordion.Body>
							{infracoes.length > 0 ? (
								<Table>
									<thead>
										<tr>
											<th>Nome</th>
											<th>Matricula</th>
											<th>Veículo</th>
											<th>Velocidade</th>
											<th>Evento</th>
										</tr>
									</thead>
									<tbody>
										{infracoes.map((i, idx) => (
											<tr key={idx}>
												<td>{i.nome}</td>
												<td>{i.matricula}</td>
												<td>{i.veiculo}</td>
												<td>{i.velocidade}</td>
												<td>{i.tipo_evento}</td>
											</tr>
										))}
									</tbody>
								</Table>
							) : (
								<>
									<div> Sem informações...</div>
								</>
							)}
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item
						eventKey="3"
						style={{ marginTop: "15px", marginBottom: "30px" }}
					>
						{loadBar ? (
							<ProgressBar variant="success" animated now={randomValue.load4} />
						) : (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "flex-start",
									paddingTop: "5px",
									paddingLeft: "5px",
								}}
							>
								{hasdata.interjornada == 1 ? (
									<Badge bg="success">Dados encontrados</Badge>
								) : (
									<></>
								)}
								{hasdata.interjornada == 0 ? (
									<Badge bg="danger">Sem informações</Badge>
								) : (
									<></>
								)}
							</div>
						)}
						<Accordion.Header>
							<b>Interjornada Condutor - {interjornada.length}</b>
						</Accordion.Header>
						<Accordion.Body>
							{interjornada.length > 0 ? (
								<Table>
									<thead>
										<tr>
											<th>Nome</th>
											<th>CPF</th>
											<th>Data</th>
											<th>Jornada Normal</th>
											<th>Jornada Diária</th>
											<th>Interjornada</th>
										</tr>
									</thead>
									<tbody>
										{interjornada.map((i, idx) => (
											<tr key={idx}>
												<td>{i.nome}</td>
												<td>{i.cpf}</td>
												<td>{formatDateTimeZone(i.data)}</td>
												<td>{i.jornada_normal}</td>
												<td>{i.jornada_diaria}</td>
												<td>{i.interjornada}</td>
											</tr>
										))}
									</tbody>
								</Table>
							) : (
								<>
									<div> Sem informações...</div>
								</>
							)}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Container>
		</>
	);
};

export default Estatisticas;
