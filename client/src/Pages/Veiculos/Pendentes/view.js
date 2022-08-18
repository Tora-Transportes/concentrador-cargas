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
					"<h2>Bem-vindo</h2><div>A tela de monitoramento de veículos</div>",
				placement: "bottom",
			},
			{
				element: "#rows-monit",
				description:
					"<h2>Linhas da tabela</h2><div>Nesta opção você define a quantidade de linhas que será exibidas na tabela.</div>",
				placement: "bottom",
			},
			{
				element: "#total-reg",
				description:
					"<h2>Total de registros</h2><div>Total de resultados exibidos na tabela abaixo.</div>",
				placement: "bottom",
			},
			{
				element: "#Tabela-coordenadas",
				description: "<h2>Tabela de Monitoramento</h2><div></div>",
				placement: "top",
			},
			{
				element: "#Botao-voltar-pag",
				description:
					"<h2>Próxima Página</h2><div>Seguirá para uma próxima aba da tabela.</div>",
				placement: "top",
			},
			{
				element: "#Botao-proxima-pag",
				description:
					"<h2>Voltar Página</h2><div>Voltará para uma aba anterior da tabela.</div>",
				placement: "top",
			},
		],
		onComplete: function () {
			window.location.reload();
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
