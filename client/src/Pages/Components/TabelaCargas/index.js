import React, { useEffect, useState, useRef } from "react";
import { Table, Pagination, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import useDebouncedFunction from "../useDebounceFunction";
import "./index.css";

function TabelaCargas({ columns, get_data, values, responsive = true }) {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const { results, total_pages, current_page } = values;
		setData(results);
		setPage(current_page);
		setTotalPages(total_pages);
	}, [values]);

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

		await get_data(options);
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

	const firstDebounceRun = useRef(true);
	useDebouncedFunction(
		() => {
			if (firstDebounceRun.current) {
				firstDebounceRun.current = false;
				return;
			}
			console.log("DR", firstDebounceRun);
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
		<Table
			striped
			bordered
			hover
			responsive={responsive}
			className="table-external"
		>
			<thead>
				<tr>
					<td colSpan={columns.length} style={{ padding: 0, margin: 0 }}>
						<Pagination id="paginacao_barra" size="sm">
							<Pagination.Prev onClick={previousPage} />
							<Pagination.Next onClick={nextPage} />
						</Pagination>
					</td>
				</tr>
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
			<tfoot>
				<tr className="text-start">
					<td colSpan={columns.length}>
						<span className="ml-1 mr-1">
							Página {page} de {totalPages}
						</span>
					</td>
				</tr>
			</tfoot>
		</Table>
	);
}

export default TabelaCargas;
