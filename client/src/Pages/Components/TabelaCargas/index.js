import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import { Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import useDebouncedFunction from "../useDebounceFunction";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import useLocalStorage from "../useLocalstorage";
import { columns } from "../../Cargas/CollumnsTables/ColumnsTemplate.js";
import {
	footerTableFunction,
	headerTableFunction,
	//SideBarFuncition,
} from "./layoutTable";

function TabelaCargas({
	get_data,
	values,
	resetView,
	setItensPerPage,
	itensPerPage,
	paginaCargaLot,
}) {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [sortField, setSortField] = useState();
	const [sortOrder, setSortOrder] = useState();
	const tipoDeBuscaPorPagina = paginaCargaLot
		? "table-columns-lote"
		: "table-columns";
	const [storage, setStorage] = useLocalStorage(tipoDeBuscaPorPagina, columns);
	const [selectedColumns, setSelectedColumns] = useState([]);
	const firstDebounceRun = useRef(true);
	const dadosTabela = useRef(null);
	const firstRun = useRef(true);
	const toast = useRef(null);

	const onColumnToggle = (event) => {
		let selectedColumns = event.value;
		let orderedSelectedColumns = columns.filter((col) =>
			selectedColumns.some((sCol) => sCol.field === col.field)
		);
		setSelectedColumns(orderedSelectedColumns);
		setStorage(orderedSelectedColumns);
		toast.current.show({
			severity: "success",
			summary: "Coluna modificada com sucesso!",
			life: 2000,
		});
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
		for (const i in formik.values) {
			if (![undefined, null, ""].includes(formik.values[i])) {
				options.filters[i] = formik.values[i];
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

	const colunsFiltrado = columns.filter((i) =>
		storage.find((c) => c.field === i.field)
	);
	const setDynamicColums = colunsFiltrado.map((col) => {
		return (
			<Column
				columnKey={col.field}
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
							value={formik.value}
							onChange={formik.handleChange}
							className="w-100"
						/>
					)
				}
				static_column={
					col.static_column !== true &&
					!col.filterElement && (
						<Form.Control
							name={col.field}
							onChange={formik.handleChange}
							className="w-100"
						/>
					)
				}
			/>
		);
	});

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false;
		} else {
			notify();
		}
	}, [page, orderby.values, get_data]);

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

	const headerTable = headerTableFunction(
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
					reorderableColumns
					sortField={sortField}
					scrollHeight="60vh"
					sortOrder={sortOrder}
					onSort={onSort}
					className="p-datatable-responsive-grid"
					responsiveLayout="scroll"
					emptyMessage="Não foram encontrado nenhum resultado nesta busca"
					ref={dadosTabela}
					value={data}
					header={headerTable}
					footer={footerTable}
					filterDisplay="row"
					dataKey="field"
				>
					{setDynamicColums}
				</DataTable>
			</div>
		</Row>
	);
}

export default TabelaCargas;
