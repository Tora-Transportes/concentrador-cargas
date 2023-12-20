import React, { useEffect, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import useLoadingScreen from "../../Components/LoadingScreen";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Card,
	Accordion,
	Table,
} from "react-bootstrap";
import InputMask from "react-input-mask";
import ServicePPO from "src/services/ServicePPO";
import { SiGooglesheets } from "react-icons/si";
import "./style.css";

const DemonstrativoMotoristas = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [demonstrativos, setDemonstrativos] = useState([]);
	const [fields, setFields] = useState({
		cpf: "",
		ano_avaliacao: "",
		mes_avaliacao: "",
	});

	function handleChange(event) {
		const { name, value } = event.target;
		setFields((prevState) => ({ ...prevState, [name]: value }));
	}

	useEffect(() => {
		var dataAtual = new Date();
		dataAtual.setMonth(dataAtual.getMonth() - 1);

		setFields((prevState) => ({
			...prevState,
			["mes_avaliacao"]: dataAtual.getMonth() + 1,
		}));
		setFields((prevState) => ({
			...prevState,
			["ano_avaliacao"]: dataAtual.getFullYear(),
		}));
		setLoading(true);

		async function dados() {
			setLoading(true);
			const data = await ServicePPO.demonstrativos({
				ano_avaliacao: fields.ano_avaliacao,
				mes_avaliacao: fields.mes_avaliacao,
			});
			setDemonstrativos(data.data.data);
			setLoading(false);
		}

		dados();
	}, []);

	async function downloadPdf({ cpf, mes_avaliacao, ano_avaliacao }) {
		setLoading(true);
		try {
			let url = await ServicePPO.downloadDemonstrativos({
				cpf: cpf.replaceAll(".", "").replaceAll("-", ""),
				mes_avaliacao,
				ano_avaliacao,
			});
			url = url.data.url;
			console.log(process.env.REACT_APP_API_URL + "/" + url);
			setLoading(false);
			window.open(process.env.REACT_APP_API_URL + "/" + url, "_blank");
		} catch (error) {
			setLoading(false);
		}
	}

	async function handleSubmit(event) {
		setLoading(true);
		event.preventDefault();
		try {
			const data = await ServicePPO.demonstrativos({
				cpf: fields.cpf,
				ano_avaliacao: fields.ano_avaliacao,
				mes_avaliacao: fields.mes_avaliacao,
			});
			setDemonstrativos(data.data.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}

	return (
		<div>
			<LoadingScreen />
			<Menusuperior />
			<Container className="text-center">
				<Row id="title-hist-veic">
					<h1>Demonstrativo Motorista</h1>
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
									/>
								</Form.Group>
							</Col>
							<Col lg={3} sm={12}>
								<Form.Group controlId="formdistancia">
									<Form.Label>Mês</Form.Label>
									<Form.Select
										name="mes_avaliacao"
										aria-label="Default select example"
										onChange={handleChange}
										value={fields.mes_avaliacao}
									>
										<option>Selecione o Mês</option>
										<option value="1">Janeiro</option>
										<option value="2">Fevereiro</option>
										<option value="3">Março</option>
										<option value="4">Abril</option>
										<option value="5">Maio</option>
										<option value="6">Junho</option>
										<option value="7">Julho</option>
										<option value="8">Agosto</option>
										<option value="9">Setembro</option>
										<option value="10">Outubro</option>
										<option value="11">Novembro</option>
										<option value="12">Dezembro</option>
									</Form.Select>
								</Form.Group>
							</Col>
							<Col lg={3} sm={12}>
								<Form.Group controlId="formdistancia">
									<Form.Label>Ano</Form.Label>
									<Form.Select
										name="ano_avaliacao"
										aria-label="Default select example"
										onChange={handleChange}
										value={fields.ano_avaliacao}
									>
										<option>Selecione o Ano</option>
										<option value="2023">2023</option>
										<option value="2024">2024</option>
										<option value="2025">2025</option>
										<option value="2026">2026</option>
										<option value="2027">2027</option>
										<option value="2028">2028</option>
										<option value="2029">2029</option>
										<option value="2030">2030</option>
										<option value="2031">2031</option>
										<option value="2032">2032</option>
										<option value="2033">2033</option>
									</Form.Select>
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
				<Accordion
					style={{ marginTop: "20px" }}
					defaultActiveKey={["0"]}
					alwaysOpen
				>
					<Accordion.Item eventKey="0">
						<Accordion.Header>
							<b>Demonstrativo - {demonstrativos.length} registros</b>
						</Accordion.Header>
						<Accordion.Body>
							{demonstrativos.length > 0 ? (
								<Table>
									<thead>
										<tr>
											<th>Nome Motorista</th>
											<th>CPF</th>
											<th>Mês</th>
											<th>Ano</th>
											<th>Download</th>
										</tr>
									</thead>
									<tbody>
										{demonstrativos.map((i) => (
											<tr key={i.cpf}>
												<td>{i.nome}</td>
												<td>{i.cpf}</td>
												<td>{i.mes_avaliacao}</td>
												<td>{i.ano_avaliacao}</td>
												<td>
													<SiGooglesheets
														size={40}
														className="icon-download"
														onClick={() => {
															downloadPdf(i);
														}}
													/>
												</td>
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
		</div>
	);
};

export default DemonstrativoMotoristas;
