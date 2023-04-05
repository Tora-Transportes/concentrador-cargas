import React, { useEffect, useRef } from "react";
import "../Totalizadores/indicador.css";
import { useState } from "react";
import {
	Container,
	Row,
	Col,
	Table,
	Form,
	FloatingLabel,
	Button,
	Accordion,
} from "react-bootstrap";
import { FaBoxes, FaRobot, FaHandsHelping } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { MdEditCalendar } from "react-icons/md";
import { GoMailRead } from "react-icons/go";
import { RiTruckLine } from "react-icons/ri";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FilialSelect from "src/Pages/Components/FilialSelect";
import DateUtils from "../../Utils/date";
import { showToastMessage } from "src/Pages/Utils/toastMessage";
import { Toast } from "primereact/toast";
import diffiInDays from "src/Pages/Utils/diffInDays";

ChartJS.register(ArcElement, Tooltip, Legend);

function ViewRotasPendentes({
	totalizadores,
	reload,
	handleExportExcel,
	resumosDiarios,
	tempoMedioAprovacaoGr,
	statusCargaId,
}) {
	const [totalGeral, setTotalGeral] = useState(0);
	const [codigoFilial, setCodigoFilial] = useState();
	const dataInicial = useRef(null);
	const dataFinal = useRef(null);
	const toast = useRef(null);

	function percentage(total, piece) {
		try {
			const value = (Number(piece) * 100) / Number(total);
			const output = Number(value.toFixed(2));
			if (isNaN(Number(output))) {
				return 0;
			}
			return output;
		} catch (error) {
			return 0;
		}
	}

	function applyFilter() {
		const data_inicio = dataInicial.current.value;
		const data_final = dataFinal.current.value;
		const fk_filial = codigoFilial.split("-")[0];
		if (!data_inicio || !data_final || !fk_filial) {
			const message =
				"Data início, data fim e código da filial são campos obrigatórios!";
			showToastMessage(toast, "warn", message, 7000);
		} else if (new Date(data_inicio) > new Date(data_final)) {
			const message = "Data início deve ser menor ou igual a data fim!";
			showToastMessage(toast, "warn", message, 10000);
		} else if (diffiInDays(data_inicio, data_final) > 31) {
			const message =
				"O período entre a data de início e fim não pode ser maior que 31 dias!";
			showToastMessage(toast, "warn", message, 7000);
		} else {
			toast.current.clear();
			reload({
				data_inicio,
				data_final,
				fk_filial,
			});
		}
	}

	useEffect(() => {
		let total = 0;
		for (const i of totalizadores.geral) {
			total += i.total;
		}
		setTotalGeral(total);
	}, [totalizadores]);

	// const keyExcelAtivo = statusCargaId === 0 ? "ativas" : "csn_ativas";
	// const keyExcelDesativo =
	// 	statusCargaId === 0 ? "desativadas" : "csn_desativadas";

	const titlePage =
		statusCargaId === 0 ? "Indicador Operacional" : "Indicador Operacional CSN";
	return (
		<div className="class-body-relatorios">
			<Container className="text-center mb-5 mt-4">
				<p className="style-title-rel2">{titlePage}</p>
				<hr className="linha-abaixo-titulo" id="style-hr-rel" />
				<Toast ref={toast} position="top-center"></Toast>
				<span>
					O tempo médio de aprovação de veículos pelo GR é de{" "}
					<b>
						{tempoMedioAprovacaoGr?.media &&
							DateUtils.convertDateToReadableTime(tempoMedioAprovacaoGr.media)}
					</b>
				</span>

				<Accordion sm={6} lg={6} style={{ marginTop: "1.8rem" }}>
					<Accordion.Item eventKey="0">
						<Accordion.Header>
							<b className="accordion-busca-data ms-2">
								Filtrar por data <MdEditCalendar size={25} className="ms-3" />
							</b>
						</Accordion.Header>
						<Accordion.Body>
							<Row>
								<Col sm={12} md={6}>
									<FloatingLabel label="Início" className="mb-3">
										<Form.Control
											ref={dataInicial}
											type="date"
											placeholder=" "
											name="data_inicio"
										/>
									</FloatingLabel>
								</Col>
								<Col>
									<FloatingLabel label="Fim" className="mb-3">
										<Form.Control
											ref={dataFinal}
											type="date"
											placeholder=" "
											name="data_final"
										/>
									</FloatingLabel>
								</Col>
							</Row>
							<Row>
								<Col
									xl={10}
									lg={10}
									md={9}
									sm={8}
									className="col-cod-filial text-start"
								>
									<label>*Código da filial</label>
									<FilialSelect
										className="input-cod-filial"
										name="fk_filial"
										value={codigoFilial || ""}
										onChange={(event) => setCodigoFilial(event.target.value)}
									/>
								</Col>
								<Col>
									<Button id="ind-botao-aplicar" onClick={applyFilter}>
										Aplicar
									</Button>
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Row className="text-center">
					<Col xl={4} lg={5} md={7} sm={8} className="col-doughnut">
						<Doughnut
							data={{
								labels: totalizadores.geral.map((i) => i.descricao),
								datasets: [
									{
										indexAxis: 1,
										label: "# cargas",
										data: totalizadores.geral.map((i) => i.total),
										backgroundColor: [
											"rgba(252, 244, 3)",
											"rgba(252, 161, 3)",
											"rgba(11, 133, 0)",
											"rgba(247, 0, 21)",
											"rgba(115, 1, 88)",
											"rgba(66, 135, 245)",
											"rgba(112,128,144)",
											"rgba(205,92,92)",
											"rgba(0,0,139)",
										],
										borderWidth: 1,
									},
								],
							}}
						/>
					</Col>
					<Col>
						<Table
							striped
							bordered
							style={{ marginTop: "3rem", color: "black" }}
						>
							<thead>
								<tr>
									<th>Situação</th>
									<th>Total</th>
									<th>Porcentagem (total de cargas ativas)</th>
								</tr>
							</thead>
							<tbody className="cor-letras">
								{totalizadores?.geral?.map((situacao) => {
									return (
										<tr key={situacao.fk_situacao}>
											<td>{situacao.descricao}</td>
											<td>
												<b>{situacao.total}</b>
											</td>
											<td>
												<span className="porcentagem-cargas-ativas">
													{percentage(totalGeral, situacao.total)}%
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</Col>
				</Row>

				<Accordion className="class-acc-rel">
					<Accordion.Item eventKey="1">
						<Accordion.Header>
							<b className="cor-letras">Cargas Ativadas & Desativadas</b>
						</Accordion.Header>
						<Accordion.Body>
							<Table className="table-relatorios-footer">
								<thead>
									<tr>
										<th>#</th>
										<th>Situação</th>
										<th>Percentual</th>
										<th>Total</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<RiTruckLine size={30} className="icons-success" />
										</td>
										<td>Cargas Ativadas</td>
										<td>
											<span className="span-cargas-ativadas">
												{percentage(
													totalizadores.cargas_ativas +
														totalizadores.cargas_desativadas,
													totalizadores.cargas_ativas
												)}
												%
											</span>
										</td>
										<td>
											<b>{totalizadores.cargas_ativas}</b>
										</td>
										<td>
											{/* <Button
												variant=""
												onClick={() => handleExportExcel(keyExcelAtivo)}
											>
												<BsDownload />
											</Button> */}
										</td>
									</tr>

									<tr>
										<td>
											<RiTruckLine size={30} className="icons-danger" />
										</td>
										<td>Cargas Desativadas</td>
										<td>
											<span className="span-cargas-desativadas">
												{percentage(
													totalizadores.cargas_ativas +
														totalizadores.cargas_desativadas,
													totalizadores.cargas_desativadas
												)}
												%
											</span>
										</td>
										<td>
											<b>{totalizadores.cargas_desativadas}</b>
										</td>
										<td>
											{/* <Button
												variant=""
												onClick={() => handleExportExcel(keyExcelDesativo)}
											>
												<BsDownload />
											</Button> */}
										</td>
									</tr>
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>
							<b className="cor-letras">Cargas Cadastradas por Origem</b>
						</Accordion.Header>
						<Accordion.Body className="cor-letras">
							<Table>
								<thead>
									<tr>
										<th>#</th>
										<th>Situação</th>
										<th>Percentual</th>
										<th>Total</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<FaRobot size={30} className="icons-success" />
										</td>
										<td>
											Cargas extraídas do <b>PORTAL</b>
										</td>
										<td>
											<span className="span-cad-origem">
												{percentage(
													totalizadores.cadastro_manual +
														totalizadores.cadastro_portal +
														totalizadores.cadastro_email,
													totalizadores.cadastro_portal
												)}
												%
											</span>
										</td>
										<td>
											<b>{totalizadores.cadastro_portal}</b>
										</td>
										<td></td>
									</tr>

									<tr>
										<td>
											<GoMailRead size={30} className="icons-success" />
										</td>
										<td>
											Cargas extraídas do <b>E-MAIL</b>
										</td>
										<td>
											<span className="span-cad-origem">
												{percentage(
													totalizadores.cadastro_manual +
														totalizadores.cadastro_portal +
														totalizadores.cadastro_email,
													totalizadores.cadastro_email
												)}
												%
											</span>
										</td>
										<td>
											<b>{totalizadores.cadastro_email}</b>
										</td>
										<td>
											<Button
												variant=""
												onClick={() => handleExportExcel("email")}
											>
												<BsDownload />
											</Button>
										</td>
									</tr>

									<tr>
										<td>
											<FaHandsHelping size={30} className="icons-success" />
										</td>
										<td>
											Cargas cadastradas <b>MANUALMENTE</b>
										</td>
										<td>
											<span className="span-cad-origem">
												{percentage(
													totalizadores.cadastro_manual +
														totalizadores.cadastro_portal +
														totalizadores.cadastro_email,
													totalizadores.cadastro_manual
												)}
												%
											</span>
										</td>
										<td>
											<b>{totalizadores.cadastro_manual}</b>
										</td>
										<td>
											<Button
												variant=""
												onClick={() => handleExportExcel("manual")}
											>
												<BsDownload className="fw-bold" />
											</Button>
										</td>
									</tr>
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="3">
						<Accordion.Header>
							<b className="cor-letras">Lotes Ativados & Desativados</b>
						</Accordion.Header>
						<Accordion.Body className="cor-letras">
							<Table>
								<thead>
									<tr>
										<th>#</th>
										<th>Situação</th>
										<th>Percentual</th>
										<th>Total</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<FaBoxes size={30} className="icons-success" />
										</td>
										<td>Lotes Ativados</td>
										<td>
											<span className="span-lotes-ativados">
												{percentage(
													totalizadores.lotes_ativos +
														totalizadores.lotes_desativados,
													totalizadores.lotes_ativos
												)}
												%
											</span>
										</td>
										<td>
											<b>{totalizadores.lotes_ativos}</b>
										</td>
										<td>
											<Button
												variant=""
												onClick={() => handleExportExcel("lotes_ativos")}
											>
												<BsDownload />
											</Button>
										</td>
									</tr>

									<tr>
										<td>
											<FaBoxes size={30} className="icons-danger" />
										</td>
										<td>Lotes Desativados</td>
										<td>
											<span className="span-lotes-desativados">
												{percentage(
													totalizadores.lotes_ativos +
														totalizadores.lotes_desativados,
													totalizadores.lotes_desativados
												)}
												%
											</span>
										</td>
										<td>
											<b>{totalizadores.lotes_desativados}</b>
										</td>
										<td>
											<Button
												variant=""
												onClick={() => handleExportExcel("lotes_desativados")}
											>
												<BsDownload />
											</Button>
										</td>
									</tr>
								</tbody>
							</Table>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<p className="text-obs-listagem">
					Obs: A listagem de cargas transportadas por dia só vai aparecer caso o
					filtro esteja aplicado com filial, data inicial e data final.
				</p>
				{dataInicial?.current?.value &&
					dataFinal?.current?.value &&
					codigoFilial && (
						<>
							<Row>
								<Col>
									<Button
										id="button-baixar-cargas-filter"
										onClick={() => handleExportExcel("completo")}
									>
										Baixar todas as cargas do filtro{" "}
										<BsDownload className="ms-2" />
									</Button>
								</Col>
							</Row>
							<hr />
							<Row>
								<Col>
									<Table striped bordered hover>
										<thead>
											<tr>
												<th>Total peso cadastrado</th>
												<th>Total peso transportado</th>
												<th>Viagens realizadas</th>
												<th>Data de cadastro</th>
												<th>Filial</th>
												<th>Unidade Medida</th>
											</tr>
										</thead>
										<tbody>
											{resumosDiarios?.map((resumo) => {
												return (
													<tr key={resumo.data_cadastro}>
														<td>{resumo.total_peso_cadastrado}</td>
														<td>{resumo.total_peso_transportado}</td>
														<td>{resumo.viagens_realizadas}</td>
														<td>
															{resumo.data_cadastro
																.split("-")
																.reverse()
																.join("/")}
														</td>
														<td>
															{resumo.fk_filial} - {resumo.nome_filial}
														</td>
														<td>{resumo.unidade_medida}</td>
													</tr>
												);
											})}
										</tbody>
									</Table>
								</Col>
							</Row>
						</>
					)}
			</Container>
		</div>
	);
}

export default ViewRotasPendentes;
