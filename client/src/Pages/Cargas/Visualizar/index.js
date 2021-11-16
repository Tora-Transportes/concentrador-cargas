import React, { useState } from "react";
import {
	Container,
	Row,
	Col,
	Table,
	InputGroup,
	FormControl,
	Button,
} from "react-bootstrap";
import {
	BsPencilSquare,
	BsTrash,
	BsBoxArrowInUpRight,
	BsSearch,
} from "react-icons/bs";
import { GrPrevious, GrNext } from "react-icons/gr";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import useDebouncedFunction from "../../Components/useDebounceFunction";

function VisualizarCargas() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [searchResult, setSearchResult] = useState({
		data: {
			total_pages: 1,
			results: [],
		},
	});

	const handleSearch = (event) => {
		setSearch(event.target.value);
	};

	const searchFunction = async ({ querySearch, pageSearch }) => {
		setLoading(true);
		const { data } = await ServiceCargas.search({
			q: querySearch,
			page: pageSearch,
		});
		setSearchResult(data);
		setLoading(false);
	};

	function handlePreviousPage() {
		let nextPage = 1;
		if (page - 1 >= 1) {
			nextPage = page - 1;
			setPage(nextPage);
			searchFunction({ pageSearch: nextPage, querySearch: search });
		}
	}

	function handleNextPage() {
		let nextPage = 1;

		if (
			!searchResult?.data?.total_pages ||
			page + 1 <= searchResult.data.total_pages
		) {
			nextPage = page + 1;
		} else {
			nextPage = Number(searchResult.data.total_pages);
		}

		if (nextPage !== page) {
			setPage(nextPage);
			searchFunction({ pageSearch: nextPage, querySearch: search });
		}
	}

	useDebouncedFunction(
		() => {
			setPage(1);
			searchFunction({ querySearch: search, pageSearch: 1 });
		},
		search,
		800
	);

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
				await searchFunction();
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
					<InputGroup className="mb-2">
						<InputGroup.Text>
							<BsSearch />
						</InputGroup.Text>
						<FormControl onChange={handleSearch} placeholder="..." />
					</InputGroup>
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
								<Button variant="outline-info" onClick={handlePreviousPage}>
									<GrPrevious />
								</Button>
								<Button variant="outline-info" onClick={handleNextPage}>
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
										<td>{formatDate(i.data_entrega)}</td>
										<td>{formatDate(i.data_coleta)}</td>
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
