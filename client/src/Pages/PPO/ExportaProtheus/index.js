import React, { useState } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import ServicePPO from "src/services/ServicePPO";
import ServicePPOGrupos from "src/services/ServicePPOGrupos";
import swal2 from "sweetalert2";
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
import { useEffect } from "react";
import { FaFileExport, FaSearch } from "react-icons/fa";

const ExportaProtheus = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [dados, setDados] = useState([]);
	const [grupos, setGrupos] = useState([]);
	const [fields, setFields] = useState({
		cpf: undefined,
		mes: "",
		ano: "",
		grupo_id: undefined,
	});

	function handleChange(event) {
		const { name, value } = event.target;
		setFields((prevState) => ({ ...prevState, [name]: value }));
	}

	async function buscaDataProtheus() {
		if (!fields.mes || !fields.ano) {
			await swal2.fire({
				icon: "info",
				title: "Atenção!",
				text: "Favor Selecionar mês e ano para pesquisar",
			});
		} else {
			setDados([]);
			setLoading(true);
			console.log(fields);
			if (fields.grupo_id == "" || fields.grupo_id == undefined) {
				fields.grupo_id = undefined;
			}
			if (fields.cpf == "" || fields.cpf == undefined) {
				fields.cpf = undefined;
			}
			try {
				const interjornada = (await ServicePPO.protheus(fields)).data;
				if (interjornada.data.length > 0) {
					setDados(interjornada.data);
				} else {
					await swal2.fire({
						icon: "info",
						title: "Atenção!",
						text: "Informações não encontrada",
					});
				}
			} catch (error) {
				setLoading(false);
			}
			setLoading(false);
		}
	}

	async function downloadTxt() {
		setLoading(true);
		if (!fields.mes || !fields.ano) {
			await swal2.fire({
				icon: "info",
				title: "Atenção!",
				text: "Favor Selecionar mês e ano para exportação",
			});
		} else {
			await ServicePPO.protheusTxt(fields);
		}
		setLoading(false);
	}

	function handleSubmit(event) {
		event.preventDefault();
		buscaDataProtheus();
	}

	useEffect(() => {
		setLoading(true);
		async function dados() {
			const data = await ServicePPOGrupos.list();
			setGrupos(data.data.data);
		}
		dados();
		setLoading(false);
	}, []);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="text-center">
				<Row id="title-hist-veic">
					<h1>Exportar Protheus</h1>
				</Row>
				<Form onSubmit={handleSubmit}>
					<Card className="mt-3">
						<Row className="row-input-history">
							<Col lg={2} sm={12}>
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
								<Form.Group
									className="mb-3"
									controlId="exampleForm.ControlInput1"
								>
									<Form.Label>Grupo</Form.Label>
									<Form.Select
										aria-label="Default select example"
										name="grupo_id"
										onChange={handleChange}
										value={fields.grupo_id}
									>
										<option></option>
										{grupos.map((value, idx) => (
											<option key={idx} value={value.id}>
												{value.filial}
											</option>
										))}
									</Form.Select>
								</Form.Group>
							</Col>
							<Col lg={2} sm={12}>
								<Form.Group
									className="mb-3"
									controlId="exampleForm.ControlInput1"
								>
									<Form.Label>Mês</Form.Label>
									<Form.Select
										aria-label="Default select example"
										name="mes"
										onChange={handleChange}
										value={fields.mes}
										required
									>
										<option></option>
										<option value="01">Janeiro</option>
										<option value="02">Fevereiro</option>
										<option value="03">Março</option>
										<option value="04">Abril</option>
										<option value="05">Maio</option>
										<option value="06">Junho</option>
										<option value="07">Julho</option>
										<option value="08">Agosto</option>
										<option value="09">Setetembro</option>
										<option value="10">Outubro</option>
										<option value="11">Novembro</option>
										<option value="12">Dezembro</option>
									</Form.Select>
								</Form.Group>
							</Col>
							<Col lg={2} sm={12}>
								<Form.Group
									className="mb-3"
									controlId="exampleForm.ControlInput2"
								>
									<Form.Label>Ano</Form.Label>
									<Form.Select
										aria-label="Default select example"
										name="ano"
										onChange={handleChange}
										value={fields.ano}
										required
									>
										<option></option>
										<option value="2023">2023</option>
										<option value="2024">2024</option>
										<option value="2025">2025</option>
										<option value="2026">2026</option>
										<option value="2027">2027</option>
									</Form.Select>
								</Form.Group>
							</Col>
							<Col lg={1} sm={12}>
								<Button
									style={{
										marginTop: "37px",
										backgroundColor: "#00652e",
										borderColor: "#00652e",
									}}
									type="submit"
								>
									<FaSearch />
								</Button>
							</Col>

							<Col lg={1} sm={12}>
								<Button
									style={{
										marginTop: "37px",
										backgroundColor: "#00652e",
										borderColor: "#00652e",
									}}
									onClick={downloadTxt}
								>
									<FaFileExport />
								</Button>
							</Col>
						</Row>
					</Card>
					<Accordion
						style={{ marginTop: "20px" }}
						defaultActiveKey={["0"]}
						alwaysOpen
					>
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								<b>Dados - {dados.length} </b>
							</Accordion.Header>
							<Accordion.Body>
								{dados.length > 0 ? (
									<Table>
										<thead>
											<tr>
												<th>Filial</th>
												<th>Matricula</th>
												<th>Cod. Verba</th>
												<th>Total</th>
												<th>Linha Exportação</th>
											</tr>
										</thead>
										<tbody>
											{dados.map((i, idx) => (
												<tr key={idx}>
													<td>{i.filial}</td>
													<td>{i.matricula}</td>
													<td>{i.cod_verba}</td>
													<td>{i.total}</td>
													<td>{i.exporta_final}</td>
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
				</Form>
			</Container>
		</>
	);
};

export default ExportaProtheus;
