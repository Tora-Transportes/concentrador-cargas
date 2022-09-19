import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import { Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import useDebouncedFunction from "../useDebounceFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import useLocalStorage from "../useLocalstorage";
import { footerTableFunction, headerTableFunction } from "./layoutTable";

function TabelaCargas({
	columns,
	get_data,
	values,
	hideHeader,
	resetView,
	setItensPerPage,
	itensPerPage,
	tipoDeBuscaPorPagina,
}) {
	const [data, setData] = useState([]);
	const [storage, setStorage] = useLocalStorage(tipoDeBuscaPorPagina, columns);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [sortField, setSortField] = useState();
	const [sortOrder, setSortOrder] = useState();
	const initialSelectColumns = columns.filter((i) =>
		storage.find((c) => {
			if (c.name === i.name) return c;
		})
	);
	const [selectedColumns, setSelectedColumns] = useState(initialSelectColumns);
	const dadosTabela = useRef(null);
	const toast = useRef(null);

	// functions of tables
	const onColumnToggle = (event) => {
		let selectedColumns = event.value;
		setSelectedColumns(selectedColumns);
		setStorage(selectedColumns);
		toast.current.show({
			severity: "success",
			summary: "Coluna modificada com sucesso!",
			life: 2000,
		});
	};

	const ordernarUnidadeColunas = (e) => {
		const sequenciaColuns = e.columns.map((item) => item.props.field);
		const arrayColumns = [];
		if (storage) {
			sequenciaColuns.filter((i) =>
				storage.find((c) => {
					if (c.name === i) arrayColumns.push(c);
				})
			);
			setStorage(arrayColumns);
			toast.current.show({
				severity: "success",
				summary: "Coluna modificada com sucesso!",
				life: 2000,
			});
		}
	};

	useEffect(() => {
		const { total_pages, results, current_page } = values;
		setData(results);
		setPage(current_page);
		setTotalPages(total_pages);
	}, [values]);

	const formik = useFormik({
		initialValues: {},
	});

	const orderby = useFormik({
		initialValues: {
			column: "",
			direction: "asc",
		},
	});

	const onSort = (e) => {
		console.log("Teste", e);
		if (e.sortOrder === 1) {
			console.log("if 1", e);
			orderby.setValues({
				columns,
				direction: "asc",
			});
		} else {
			console.log("if 2", e);
			orderby.setValues({
				columns,
				direction: "desc",
			});
		}
		setSortField();
		setSortOrder();
	};

	async function notify() {
		const options = {
			filters: {},
			orderBy: {
				column: "",
				direction: "asc",
			},
			page: 1,
		};
		columns;

		//columns
		for (const i in formik.values) {
			if (![undefined, null, ""].includes(formik.values[i])) {
				options.filters[i] = formik.values[i];
			}
		}

		// // direction
		if (orderby.values.column) {
			options.orderBy.column = orderby.values.column;
			options.orderBy.direction = orderby.values.direction;
		} else {
			options.orderBy = null;
		}

		//page
		options.page = page;
		console.log("teste este", options);
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

	const colunsFiltrado = [];
	storage.filter((i) =>
		columns.find((c) => {
			if (c.name === i.name) colunsFiltrado.push(c);
		})
	);

	const setDynamicColums = colunsFiltrado.map((col) => {
		return (
			<Column
				columnKey={col.name}
				key={col.name}
				field={col.name}
				style={col.style}
				header={col.description}
				body={col.selector}
				sortable={col.sortable}
				filter={true}
				filterElement={
					col.Filter ? (
						<col.Filter
							name={col.name}
							value={formik.value}
							onChange={formik.handleChange}
							className="w-100"
						/>
					) : (
						col.static_column !== true && (
							<Form.Control
								name={col.name}
								onChange={formik.handleChange}
								className="w-100"
							/>
						)
					)
				}
			/>
		);
	});
	const firstRun = useRef(true);
	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false;
		} else {
			notify();
		}
	}, [page, orderby.values, get_data]);
	const firstDebounceRun = useRef(true);
	useDebouncedFunction(
		() => {
			if (firstDebounceRun.current) {
				firstDebounceRun.current = false;
				return;
			}
			if (page === 1) {
				notify();
			} else {
				setPage(1);
			}
		},
		formik.values,
		1000
	);

	const headerTable = hideHeader
		? ""
		: headerTableFunction(
				resetView,
				itensPerPage,
				setItensPerPage,
				selectedColumns,
				columns,
				onColumnToggle
		  );

	const footerTable = footerTableFunction(previousPage, nextPage);

	return (
		<Row>
			<Toast ref={toast} className="w-25"></Toast>
			<div className="datatable-responsive-gridCargas">
				<DataTable
					id="Tabela-coordenadas"
					reorderableColumns
					onColReorder={ordernarUnidadeColunas}
					sortField={sortField}
					responsiveLayout="scroll"
					scrollHeight="60vh"
					sortOrder={sortOrder}
					onSort={onSort}
					className="p-datatable-responsive-grid"
					emptyMessage="Não foram encontrado nenhum resultado nesta busca"
					ref={dadosTabela}
					value={data}
					header={headerTable}
					footer={footerTable}
					filterDisplay="row"
					dataKey="name"
				>
					{setDynamicColums}
				</DataTable>
			</div>
		</Row>
	);
}

export default TabelaCargas;
