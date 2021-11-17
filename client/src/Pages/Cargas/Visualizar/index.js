import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import {
	BsPencilSquare,
	BsTrash,
	BsBoxArrowInUpRight,
	BsSearch,
	BsDownload,
} from "react-icons/bs";
import { GrPrevious, GrNext } from "react-icons/gr";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import useFilterCargas, { CargaFilter } from "../../Components/useFilterCargas";

function VisualizarCargas() {
	const [LoadingScreen, setLoading] = useLoadingScreen();

	const [page, setPage] = useState(1);
	const [searchResult, setSearchResult] = useState({
		data: {
			total_pages: 1,
			results: [],
		},
	});
	const { formikFilter } = useFilterCargas();

	async function search(values) {
		setLoading(true);
		setSearchResult((await ServiceCargas.search({ ...values, page })).data);
		setLoading(false);
	}

	function nextPage() {
		if (page + 1 <= searchResult.data.total_pages) setPage(page + 1);
	}

	function previousPage() {
		if (page !== 1) {
			setPage(page - 1);
		}
	}

	async function handleDownload() {
		setLoading(true);
		const response = await ServiceCargas.exportToXlsx(formikFilter.values);
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`RELATORIO-CARGAS_${new Date().getTime()}.xlsx`
		);
		link.click();

		setLoading(false);
	}

	async function handleDelete(id) {
		try {
			const shouldDelete = await swal(
				"Ops ! 😯",
				"Tem certeza que deseja excluir?",
				"warning",
				{
					buttons: ["NÃO!", true],
				}
			);
			if (shouldDelete) {
				setLoading(true);
				await ServiceCargas.delete({ id });
				swal("Sucesso!", "O registro foi eliminado", "success");
				search(formikFilter.values);
			} else {
				swal("O registro está seguro");
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	function formatDate(date) {
		if (!date) return "";
		let strDate = date;
		if (date instanceof Date) {
			strDate = date.toISOString();
		}
		return strDate.split("T")[0].split("-").reverse().join("-");
	}

	useEffect(() => {
		search(formikFilter.values);
	}, [page]);

	return (
		<>
			<CargaFilter
				formik={formikFilter}
				onFilter={(values) => {
					search(values);
					setPage(1);
				}}
			/>
			<LoadingScreen />
			<NavbarNavigator />
			<Container fluid className="text-center mb-5">
				<Row>
					<Col>
						<h1 className="mb-5 mt-5">Visualize as cargas cadastradas aqui</h1>
					</Col>
				</Row>
				<Row>
					<Col></Col>
				</Row>
				<Row>
					<Col sm={12}>
						<Row className="text-end">
							<Col>
								Página <strong>{page}</strong> de{" "}
								<strong>{searchResult?.data?.total_pages || 1}</strong>
							</Col>
						</Row>
						<Row className="text-end mb-3">
							<Col>
								<Button onClick={handleDownload} variant="outline-info">
									<BsDownload />
								</Button>
								<Button
									variant="outline-info"
									onClick={() => formikFilter.setFieldValue("show", true)}
								>
									<BsSearch />
								</Button>
								<Button onClick={previousPage} variant="outline-info">
									<GrPrevious />
								</Button>
								<Button onClick={nextPage} variant="outline-info">
									<GrNext />
								</Button>
							</Col>
						</Row>
						<Table responsive striped bordered hover>
							<thead>
								<tr>
									<th>#</th>
									<th>ID</th>
									<th>Cliente</th>
									<th>Origem</th>
									<th>Destino</th>
									<th>Data coleta</th>
									<th>Data entrega</th>
									<th>Editar</th>
									<th>Excluir</th>
								</tr>
							</thead>
							<tbody>
								{searchResult?.data?.results.map((i) => (
									<tr key={i.id}>
										<td>
											<Link
												to={`/cargas/${i.canal_comunicacao}/${i.id}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<BsBoxArrowInUpRight />
											</Link>
										</td>
										<td>{i.id}</td>
										<td>{i.cliente}</td>
										<td>{i.origem_carga}</td>
										<td>{i.destino_carga}</td>
										<td>{formatDate(i.data_coleta)}</td>
										<td>{formatDate(i.data_entrega)}</td>
										<td>
											<Link to={`/cargas/${i.canal_comunicacao}/${i.id}`}>
												<BsPencilSquare />
											</Link>
										</td>
										<td>
											<BsTrash onClick={() => handleDelete(i.id)} />
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default VisualizarCargas;
