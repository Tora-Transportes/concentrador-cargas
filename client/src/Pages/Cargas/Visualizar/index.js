import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Table,
	InputGroup,
	FormControl,
} from "react-bootstrap";
import {
	BsPencilSquare,
	BsTrash,
	BsPlusSquare,
	BsSearch,
} from "react-icons/bs";
import NavbarNavigator from "../../Components/NavbarNavigator";
import ServiceCargas from "../../../services/ServiceCargas";
import useLoadingScreen from "../../Components/LoadingScreen";
import { Link } from "react-router-dom";
import swal from "sweetalert";

function useDebouncedFunction(handler, watchedValue, delay) {
	useEffect(() => {
		const timeoutHandler = setTimeout(() => {
			handler();
		}, delay);
		return () => {
			clearTimeout(timeoutHandler);
		};
	}, [watchedValue, delay]);
}

function VisualizarCargas() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState({});

	const handleSearch = (event) => {
		setSearch(event.target.value);
	};

	useDebouncedFunction(
		async () => {
			setLoading(true);
			const { data } = await ServiceCargas.search({
				q: search,
			});
			setSearchResult(data);
			setLoading(false);
		},
		search,
		800
	);

	useEffect(() => {}, []);

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
				await ServiceCargas.delete({ id });
				swal("Sucesso!", "O registro foi eliminado", "success");
			} else {
				swal("O registro está seguro");
			}
		} catch (error) {
			console.log(error);
		}
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
											<BsPlusSquare />
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
