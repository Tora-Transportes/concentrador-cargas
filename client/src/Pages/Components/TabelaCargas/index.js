import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import { useFormik } from "formik";
import useDebouncedFunction from "../useDebounceFunction";
import { DataTable } from "primereact/datatable";
//import { BsGear } from "react-icons/bs";
import { Column } from "primereact/column";
import { IoIosRefreshCircle } from "react-icons/io";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
//import CaptionStatusCarga from "../CaptionStatusCarga";
import { MultiSelect } from "primereact/multiselect";

function TabelaCargas({
	columns,
	get_data,
	values,
	//handleExportExcel,
	//handleToggleModal,
	resetView,
	setItensPerPage,
	itensPerPage,
}) {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	//const [dynamicColumns, setDynamicColums] = useState();
	const [sortField, setSortField] = useState();
	const [sortOrder, setSortOrder] = useState();
	const [selectedColumns, setSelectedColumns] = useState(columns);
	//const [globalFilter, setGlobalFilter] = useState();
	const dadosTabela = useRef(null);

	const onColumnToggle = (event) => {
		let selectedColumns = event.value;
		let orderedSelectedColumns = columns.filter((col) =>
			selectedColumns.some((sCol) => sCol.field === col.field)
		);
		setSelectedColumns(orderedSelectedColumns);
	};

	const onSort = (e) => {
		setSortField(e.sortField);
		setSortOrder(e.sortOrder);
	};

	useEffect(() => {
		const { total_pages, results, current_page } = values;
		setData(results);
		setPage(current_page);
		setTotalPages(total_pages);
		//setGlobalFilter();
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

	// function getOrderByIcon(columnName) {
	// 	if (columnName === orderby.values.column) {
	// 		return orderby.values.direction === "desc" ? (
	// 			<AiOutlineArrowDown />
	// 		) : (
	// 			<AiOutlineArrowUp />
	// 		);
	// 	}
	// }

	// useEffect(() => {
	// 	(async () => {
	const setDynamicColums = selectedColumns.map((col) => {
		return (
			<Column
				key={col.field}
				field={col.field}
				style={col.style}
				header={col.header}
				body={col.body}
				sortable={col.sortable}
				filter={true}
				filterPlaceholder={col.filterPlaceholder}
				filterElement={
					col.filterElement && (
						<col.filterElement
							name={col.field}
							value={filter.getFieldProps("fk_situacao").value || ""}
							onChange={filter.handleChange}
							className="w-100"
						/>
					)
				}
				static_column={
					col.static_column !== true &&
					!col.Filter && (
						<Form.Control
							name={col.field}
							onChange={filter.handleChange}
							className="w-100"
						/>
					)
				}
			/>
		);
	});

	//})();
	//}, [data, page, columns]);

	const header = (
		<Container fluid>
			<Row className="header-table">
				<Col
					className="header-col-multiselect text-start"
					style={{ marginLeft: "-26px" }}
				>
					<MultiSelect
						value={selectedColumns}
						options={columns}
						optionLabel="header"
						onChange={onColumnToggle}
						style={{
							height: "43px",
							alignItems: "center",
							width: " 15.7em",
						}}
						filterPlaceholder="Procurar"
						placeholder="config tabela"
					/>
				</Col>
				<Col>
					<select
						className="btn"
						value={itensPerPage}
						onChange={(e) => setItensPerPage(e.target.value)}
					>
						<option value="5">👀 5</option>
						<option value="10">👀 10</option>
						<option value="20">👀 20</option>
						<option value="50">👀 50</option>
						<option value="100">👀 100</option>
						<option value="500">👀 500</option>
					</select>
				</Col>
				<Col className=" header-col-atualiza">
					<Button
						variant="primary"
						onClick={resetView}
						className="header-button-atualiza"
					>
						<IoIosRefreshCircle /> Atualizar tabela
					</Button>
				</Col>
			</Row>
		</Container>
	);

	const footerTemplateVendedor = () => {
		return (
			<Col className="footer-table">
				<Button variant="outline-info" onClick={previousPage}>
					<HiChevronDoubleLeft /> Voltar paginação
				</Button>
				<Button variant="outline-info" onClick={nextPage}>
					Proxíma paginação <HiChevronDoubleRight />
				</Button>
			</Col>
		);
	};

	const firstRun = useRef(true);
	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false;
		} else {
			notify();
		}
	}, [page, orderby.values, get_data]);

	useEffect(() => {
		//console.log(page);
	}, [page]);

	const firstDebounceRun = useRef(true);
	useDebouncedFunction(
		() => {
			if (firstDebounceRun.current) {
				firstDebounceRun.current = false;
				return;
			}
			//console.log("DR", firstDebounceRun);
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
		<div>
			<div className="datatable-responsive-gridCargas">
				<DataTable
					reorderableColumns
					//onRowReorder={(e) => setData(e.value)}
					sortField={sortField}
					sortOrder={sortOrder}
					onSort={onSort}
					className="p-datatable-responsive-grid"
					responsiveLayout="scroll"
					emptyMessage="Não foram encontradas cobranças"
					ref={dadosTabela}
					value={data}
					header={header}
					footer={footerTemplateVendedor}
					filterDisplay="row"
				>
					<Column header="Mover Linha" rowReorder />
					{setDynamicColums}
				</DataTable>
			</div>
		</div>
	);
}

export default TabelaCargas;
