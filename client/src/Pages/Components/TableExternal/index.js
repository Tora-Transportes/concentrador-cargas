import React, { useEffect, useState, useRef } from "react";
import { Table, Row, Col, Container, Pagination, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import useDebouncedFunction from "../useDebounceFunction";
import ServiceCargas from "../../../services/ServiceCargas";
import "./index.css";

function TableExternal({ columns, get_data }) {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const filter = useFormik({
		initialValues: {},
	});

	const orderby = useFormik({
		initialValues: {
			column: "",
			direction: "asc",
		},
	});

	async function notify() {
		const options = {
			filters: {},
			orderBy: {
				column: "",
				direction: "asc",
			},
			page: 1,
		};

		// columns
		for (const i in filter.values) {
			if (![undefined, null, ""].includes(filter.values[i])) {
				options.filters[i] = filter.values[i];
			}
		}

		// direction
		if (orderby.values.column) {
			options.orderBy.column = orderby.values.column;
			options.orderBy.direction = orderby.values.direction;
		} else {
			options.orderBy = null;
		}

		//page
		options.page = page;

		const { data, total_pages, current_page } = await get_data(options);
		setData(data);
		setPage(current_page);
		setTotalPages(total_pages);
	}

	async function nextPage() {
		setPage((v) => {
			return v + 1 <= totalPages ? v + 1 : v;
		});
	}

	async function previousPage() {
		setPage((v) => {
			return v - 1 < 1 ? v : v - 1;
		});
	}

	function getOrderByIcon(columnName) {
		if (columnName === orderby.values.column) {
			return orderby.values.direction === "desc" ? (
				<AiOutlineArrowDown />
			) : (
				<AiOutlineArrowUp />
			);
		}
	}

	const firstRun = useRef(true);
	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false;
		} else {
			notify();
		}
	}, [page, orderby.values, get_data]);

	useEffect(() => {
		console.log(page);
	}, [page]);

	useDebouncedFunction(
		() => {
			if (page === 1) {
				notify();
			} else {
				setPage(1);
			}
		},
		filter.values,
		1000
	);

	return (
		<Container>
			<Table striped bordered hover responsive className="table-external">
				<thead>
					<tr>
						{columns.map((i) => (
							<th key={"col-header-" + i.name} className="text-center">
								<a
									className="text-decoration-none text-black"
									href="#"
									onClick={(e) => {
										e.preventDefault();
										if (i.static_column === true) {
											return;
										}
										const column = i.name;
										if (
											orderby.values.column === column &&
											orderby.values.direction === "asc"
										) {
											orderby.setValues({
												column,
												direction: "desc",
											});
										} else {
											orderby.setValues({
												column,
												direction: "asc",
											});
										}
									}}
								>
									{i.description} {getOrderByIcon(i.name)}
								</a>
							</th>
						))}
					</tr>
					<tr>
						{columns.map((i) => (
							<th key={"col-header-2-" + i.name} className="text-center">
								{i.Filter && (
									<i.Filter
										name={i.name}
										value={filter.getFieldProps(i.name).value || ""}
										onChange={filter.handleChange}
										className="w-100"
									/>
								)}
								{i.static_column !== true && !i.Filter && (
									<Form.Control
										name={i.name}
										onChange={filter.handleChange}
										className="w-100"
									/>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data?.map((row, index) => (
						<tr key={"row-" + index}>
							{columns.map((col, indexCol) => (
								<td key={"col-" + indexCol}>{col.selector(row)}</td>
							))}
						</tr>
					))}
				</tbody>
			</Table>
			<Row>
				<div className="pagination-foot">
					<Col>
						<div colSpan={columns.length}>
							<span className="ml-1 mr-1">
								Página {page} de {totalPages}
							</span>
						</div>
					</Col>
					<Col>
						<div colSpan={columns.length}>
							<Pagination className="pagination">
								<Pagination.Prev onClick={previousPage} className="me-1" />
								<Pagination.Next onClick={nextPage} />
							</Pagination>
						</div>
					</Col>
				</div>
			</Row>
		</Container>
	);
}

export default TableExternal;

export function TestPage() {
	const columns = [
		{
			name: "nome",
			description: "Nome",
			selector: (row) => `${row.nome}`,
		},
		{ name: "idade", description: "Idade", selector: (row) => `${row.idade}` },
		{
			name: "sexo",
			description: "Sexo",
			selector: (row) => `${row.sexo}`,
			Filter: (props) => (
				<select {...props} className="form-control">
					<option value=""></option>
					<option value="M">Masculino</option>
					<option value="F">Feminino</option>
					<option value="N">NA</option>
				</select>
			),
		},
	];

	// const data = [
	// 	{ nome: "A", idade: 12, sexo: "M" },
	// 	{ nome: "B", idade: 13, sexo: "N" },
	// 	{ nome: "C", idade: 22, sexo: "F" },
	// 	{ nome: "A", idade: 12, sexo: "M" },
	// 	{ nome: "B", idade: 13, sexo: "N" },
	// 	{ nome: "C", idade: 22, sexo: "F" },
	// 	{ nome: "A", idade: 12, sexo: "M" },
	// 	{ nome: "B", idade: 13, sexo: "N" },
	// 	{ nome: "C", idade: 22, sexo: "F" },
	// 	{ nome: "A", idade: 12, sexo: "M" },
	// 	{ nome: "B", idade: 13, sexo: "N" },
	// ];
	return (
		<Container>
			<Row>
				<Col>
					<TableExternal
						columns={columns}
						get_data={async function (filters) {
							const { data } = await ServiceCargas.search(filters);
							return {
								total_pages: data.total_pages,
								current_page: filters.page || 1,
								data: data.results,
							};
						}}
					/>
				</Col>
			</Row>
		</Container>
	);
}
