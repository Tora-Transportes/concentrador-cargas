import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
	Container,
	Row,
	Card,
	Col,
	Table,
	Form,
	FloatingLabel,
	Button,
} from "react-bootstrap";
import { FaPowerOff, FaRobot, FaHandsWash } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FilialSelect from "src/Pages/Components/FilialSelect";
ChartJS.register(ArcElement, Tooltip, Legend);

function ViewRotasPendentes({ totalizadores, reload, handleExportExcel }) {
	const [totalGeral, setTotalGeral] = useState(0);
	const dataInicial = useRef(null);
	const dataFinal = useRef(null);
	const [codigoFilial, setCodigoFilial] = useState(null);
	function percentage(total, piece) {
		try {
			const value = (Number(piece) * 100) / Number(total);
			return Number(value.toFixed(2));
		} catch (error) {
			return 0;
		}
	}

	function applyFilter() {
		reload({
			data_inicio: dataInicial.current.value,
			data_final: dataFinal.current.value,
			fk_filial: codigoFilial,
		});
	}

	useEffect(() => {
		let total = 0;
		for (const i of totalizadores.geral) {
			total += i.total;
		}
		setTotalGeral(total);
	}, [totalizadores]);

	return (
		<>
			<Container className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1>Visão geral</h1>
				</Row>
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
						<FloatingLabel label="Final" className="mb-3">
							<Form.Control
								ref={dataFinal}
								type="date"
								placeholder=" "
								name="data_final"
							/>
						</FloatingLabel>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col>
						<FloatingLabel label="*Código da filial" className="mb-3">
							<FilialSelect
								placeholder=" "
								name="fk_filial"
								value={codigoFilial || ""}
								onChange={(event) => setCodigoFilial(event.target.value)}
							/>
						</FloatingLabel>
					</Col>
					<Col sm={1}>
						<Button className="p-3" onClick={applyFilter}>
							Aplicar
						</Button>
					</Col>
				</Row>
				<Row className="text-center">
					<Col>
						<Card
							style={{ minWidth: "18rem" }}
							className="pt-4 pb-4 border border-success"
						>
							<Card.Body>
								<Card.Title>
									Cargas ativas
									<Button
										variant=""
										onClick={() => handleExportExcel("ativas")}
									>
										<BsDownload />
									</Button>
								</Card.Title>
								<Card.Text>
									<FaPowerOff size={30} className="text-success" />
								</Card.Text>
								<h1>
									<b>{totalizadores.cargas_ativas}</b>
								</h1>
								<Card.Text>
									<span className="text-danger">
										{percentage(
											totalizadores.cargas_ativas +
												totalizadores.cargas_desativadas,
											totalizadores.cargas_ativas
										)}
										%
									</span>{" "}
									do total de cargas
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card
							style={{ minWidth: "18rem" }}
							className="pt-4 pb-4 border border-danger"
						>
							<Card.Body>
								<Card.Title>
									Cargas desativadas{" "}
									<Button
										variant=""
										onClick={() => handleExportExcel("desativadas")}
									>
										<BsDownload />
									</Button>
								</Card.Title>
								<Card.Text>
									<FaPowerOff size={30} className="text-danger" />
								</Card.Text>
								<h1>
									<b>{totalizadores.cargas_desativadas}</b>
								</h1>
								<Card.Text>
									<span className="text-danger">
										{percentage(
											totalizadores.cargas_ativas +
												totalizadores.cargas_desativadas,
											totalizadores.cargas_desativadas
										)}
										%
									</span>{" "}
									do total de cargas
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<hr />
				<Row className="text-center">
					<Col>
						<Card
							style={{ minWidth: "18rem" }}
							className="pt-4 pb-4 border border-success"
						>
							<Card.Body>
								<Card.Title>
									Cargas extraidas do <b>PORTAL</b>
									<Button
										variant=""
										onClick={() => handleExportExcel("portal")}
									>
										<BsDownload />
									</Button>
								</Card.Title>
								<Card.Text>
									<FaRobot size={30} className="text-success" />
								</Card.Text>
								<h1>
									<b>{totalizadores.cadastro_portal}</b>
								</h1>
								<Card.Text>
									<span className="text-danger">
										{percentage(
											totalizadores.cadastro_manual +
												totalizadores.cadastro_portal,
											totalizadores.cadastro_portal
										)}
										%
									</span>{" "}
									do total de cargas
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card
							style={{ minWidth: "18rem" }}
							className="pt-4 pb-4 border border-success"
						>
							<Card.Body>
								<Card.Title>
									Cargas cadastradas <b>MANUALMENTE</b>
									<Button
										variant=""
										onClick={() => handleExportExcel("manual")}
									>
										<BsDownload />
									</Button>
								</Card.Title>
								<Card.Text>
									<FaHandsWash size={30} className="text-success" />
								</Card.Text>
								<h1>
									<b>{totalizadores.cadastro_manual}</b>
								</h1>
								<Card.Text>
									<span className="text-danger">
										{percentage(
											totalizadores.cadastro_manual +
												totalizadores.cadastro_portal,
											totalizadores.cadastro_manual
										)}
										%
									</span>{" "}
									do total de cargas
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<hr />

				<Row className="text-center">
					<Col>
						<Card
							style={{ minWidth: "18rem" }}
							className="pt-4 pb-4 border border-success"
						>
							<Card.Body>
								<Card.Title>
									Lotes ativos
									<Button
										variant=""
										onClick={() => handleExportExcel("lotes_ativos")}
									>
										<BsDownload />
									</Button>
								</Card.Title>
								<Card.Text>
									<FaPowerOff size={30} className="text-success" />
								</Card.Text>
								<h1>
									<b>{totalizadores.lotes_ativos}</b>
								</h1>
								<Card.Text>
									<span className="text-danger">
										{percentage(
											totalizadores.lotes_ativos +
												totalizadores.lotes_desativados,
											totalizadores.lotes_ativos
										)}
										%
									</span>{" "}
									do total de lotes
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card
							style={{ minWidth: "18rem" }}
							className="pt-4 pb-4 border border-danger"
						>
							<Card.Body>
								<Card.Title>
									Lotes desativados{" "}
									<Button
										variant=""
										onClick={() => handleExportExcel("lotes_desativados")}
									>
										<BsDownload />
									</Button>
								</Card.Title>
								<Card.Text>
									<FaPowerOff size={30} className="text-danger" />
								</Card.Text>
								<h1>
									<b>{totalizadores.lotes_desativados}</b>
								</h1>
								<Card.Text>
									<span className="text-danger">
										{percentage(
											totalizadores.lotes_ativos +
												totalizadores.lotes_desativados,
											totalizadores.lotes_desativados
										)}
										%
									</span>{" "}
									do total de lotes
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<hr />

				<Row className="text-center mx-auto">
					<Col lg={4} md={6} sm={12}>
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
										],
										borderWidth: 1,
									},
								],
							}}
						/>
					</Col>
					<Col>
						{/* {totalizadores?.geral?.map((situacao) => {
							return (
								<Col key={situacao.fk_situacao} sm={12}>
									<Card className="border border-success">
										<Card.Body>
											<Card.Title>{situacao.descricao}</Card.Title>
											<h1>
												<b>{situacao.total}</b>
											</h1>
											<Card.Text>
												<span className="text-danger">
													{percentage(totalGeral, situacao.total)}%
												</span>{" "}
												do total de cargas
											</Card.Text>
										</Card.Body>
									</Card>
								</Col>
							);
						})} */}
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Situação</th>
									<th>Total</th>
									<th>Porcentagem (total de cargas ativas)</th>
								</tr>
							</thead>
							<tbody>
								{totalizadores?.geral?.map((situacao) => {
									return (
										<tr key={situacao.fk_situacao} sm={12}>
											<td>{situacao.descricao}</td>
											<td>
												<b>{situacao.total}</b>
											</td>
											<td>
												<span className="text-danger">
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
			</Container>
		</>
	);
}

export default ViewRotasPendentes;
