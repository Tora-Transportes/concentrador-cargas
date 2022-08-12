import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TabelaCargas from "../../Components/TabelaCargas";
import createSequence from "tooltip-sequence";
import "../../Styles/index.css";
function ViewRotasPendentes({
	columns = [],
	get_data,
	data,
	itensPerPage,
	setItensPerPage,
	totalRegisters = 0,
}) {
	const options = {
		backdropColor: "#6262625d",
		sequence: [
			{
				element: "#title-monit",
				description:
					"<h2>Don't forget to import!</h2><div>Add these lines when using in a front end framework.</div>",
				placement: "bottom",
			},
			{
				element: "#rows-monit",
				description:
					"<h2>Color, color, everywhere!</h2><div>Option to choose the backdrop color.</div>",
				placement: "bottom",
			},
			{
				element: "#total-reg",
				description:
					"<h2>Placement - Top! ⬆️</h2><div>Option to place the tooltip on the top of the element.</div>",
				placement: "bottom",
			},
			{
				element: "#Tabela-coordenadas",
				description:
					"<h2>Placement - Right! ➡️</h2><div>Option to place the tooltip on the right of the element.</div>",
				placement: "top",
			},
			{
				element: "#Botao-voltar-pag",
				description:
					"<h2>Installation Package!</h2><div>To install via npm or use the cdn check out this.</div>",
				placement: "top",
			},
			{
				element: "#Botao-proxima-pag",
				description:
					"<h2>Installation Package!</h2><div>To install via npm or use the cdn check out this.</div>",
				placement: "top",
			},
		],
		onComplete: function () {
			console.log("Completed!");
		},
	};

	function handleClick(event) {
		event.preventDefault();
		createSequence(options);
	}
	return (
		<>
			<Container fluid className="text-center mb-5 mt-4">
				<Row className="mb-2">
					<h1 className="title-h1" onClick={handleClick} id="title-monit">
						Monitoramento - Veículos pendentes
					</h1>
				</Row>
				<Row>
					<Col lg={1} className="text-center ">
						<select
							id="rows-monit"
							className="btn"
							value={itensPerPage}
							onChange={(e) => setItensPerPage(e.target.value)}
						>
							<option value="10">👀 10</option>
							<option value="20">👀 20</option>
							<option value="50">👀 50</option>
							<option value="100">👀 100</option>
							<option value="500">👀 500</option>
						</select>
					</Col>
					<Col className="text-center" id="total-reg">
						Total de {totalRegisters} registros.
					</Col>
					<Col lg={1}></Col>
				</Row>
				<Row>
					<TabelaCargas
						columns={columns}
						get_data={get_data}
						values={data}
						hideHeader={true}
					/>
				</Row>
			</Container>
		</>
	);
}

export default ViewRotasPendentes;
