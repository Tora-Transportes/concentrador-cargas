import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import NavbarNavigator from "../../Components/NavbarNavigator";
import useLoadingScreen from "../../Components/LoadingScreen";
import { Link } from "react-router-dom";
import TableExternal from "../../Components/TableExternal";
import ServiceCargas from "src/services/ServiceCargas";

function VisualizarCargas() {
	const [LoadingScreen, setLoading] = useLoadingScreen();

	function formatDate(date) {
		return date.split("T")[0].split("-").reverse().join("/");
	}

	return (
		<>
			<LoadingScreen />
			<NavbarNavigator />
			<Container fluid className="text-center mb-5">
				<Row>
					<Col>
						<h1 className="mb-5 mt-5">Visualize as cargas cadastradas aqui</h1>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<TableExternal
							columns={[
								{
									name: "id",
									description: "Código da Carga",
									selector: (row) => row.id,
								},
								{
									name: "cliente",
									description: "Cliente",
									selector: (row) => row.cliente,
								},
								{
									name: "origem_carga",
									description: "Origem",
									selector: (row) => row.origem_carga,
									Filter: () => null,
								},
								{
									name: "destino_carga",
									description: "Destino",
									selector: (row) => row.destino_carga,
									Filter: () => null,
								},
								{
									name: "data_coleta",
									description: "Data coleta",
									selector: (row) => formatDate(row.data_coleta),
									Filter: (props) => <Form.Control type="date" {...props} />,
								},
								{
									name: "data_entrega",
									description: "Data Entrega",
									selector: (row) => formatDate(row.data_entrega),
									Filter: (props) => <Form.Control type="date" {...props} />,
								},
								{
									name: "data_cadastro",
									description: "Data Cadastro",
									selector: (row) => formatDate(row.data_cadastro),
									Filter: (props) => <Form.Control type="date" {...props} />,
								},
								{
									name: "tipo_carga",
									description: "Tipo Carga",
									selector: (row) => row.tipo_carga,
								},
								{
									name: "e_lote",
									description: "Lote ?",
									selector: (row) => (row.e_lote ? "Sim" : "Não"),
									Filter: (props) => (
										<Form.Select {...props}>
											<option></option>
											<option value="1">Sim</option>
											<option value="0">Não</option>
										</Form.Select>
									),
								},
								{
									name: "canal_comunicacao",
									description: "Canal comunicação",
									selector: (row) => row.canal_comunicacao,
									Filter: () => null,
								},
								{
									name: "unidade_medida",
									description: "UN",
									selector: (row) => row.unidade_medida,
									Filter: () => null,
								},
								{
									name: "quantidade",
									description: "Quantidade",
									selector: (row) => row.quantidade,
									Filter: () => null,
								},
								{
									name: "responsavel_cadastro",
									description: "Responsável Cadastro",
									selector: (row) => row.responsavel_cadastro,
								},
								{
									name: "editar",
									description: "Editar",
									static_column: true,
									selector: (row) => (
										<Link
											to={`/cargas/${row.canal_comunicacao}/${row.id}`}
											target="_blank"
											rel="noopener"
										>
											<BsPencilSquare />
										</Link>
									),
								},
							]}
							get_data={async function (options) {
								setLoading(true);
								try {
									const { filters, orderBy, page } = options;
									console.log({ filters, orderBy, page });
									const { data } = await ServiceCargas.search({
										...filters,
										page,
										order_column: orderBy?.column,
										order_direction: orderBy?.direction,
									});
									setLoading(false);
									return {
										total_pages: data.data.total_pages,
										current_page: page || 1,
										data: data.data.results,
									};
								} catch (error) {
									console.log(error);
								}
								setLoading(false);
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col sm={12}></Col>
				</Row>
			</Container>
		</>
	);
}

export default VisualizarCargas;
