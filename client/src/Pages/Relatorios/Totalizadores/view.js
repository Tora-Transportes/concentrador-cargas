import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Row, Card, Col, Table } from "react-bootstrap";
import { FaPowerOff, FaRobot, FaHandsWash } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function ViewRotasPendentes({ totalizadores }) {
	const [totalGeral, setTotalGeral] = useState(0);
	function percentage(total, piece) {
		try {
			const value = (Number(piece) * 100) / Number(total);
			return Number(value.toFixed(2));
		} catch (error) {
			return 0;
		}
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
				<Row className="text-center">
					<Col>
						<Card
							style={{ minWidth: "18rem" }}
							className="pt-4 pb-4 border border-success"
						>
							<Card.Body>
								<Card.Title>Cargas ativas</Card.Title>
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
								<Card.Title>Cargas desativadas</Card.Title>
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

				<Row className="text-center mx-auto">
					<Col lg={6} md={12}>
						<Doughnut
							data={{
								labels: totalizadores.geral.map((i) => i.descricao),
								datasets: [
									{
										label: "# cargas",
										data: totalizadores.geral.map((i) => i.total),
										backgroundColor: [
											"rgba(252, 244, 3, 0.2)",
											"rgba(252, 161, 3, 0.2)",
											"rgba(11, 133, 0, 0.2)",
											"rgba(247, 0, 21, 0.2)",
											"rgba(115, 1, 88, 0.2)",
										],
										borderColor: [
											"rgba(255, 99, 132, 1)",
											"rgba(54, 162, 235, 1)",
											"rgba(255, 206, 86, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(255, 159, 64, 1)",
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
