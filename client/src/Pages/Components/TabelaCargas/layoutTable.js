import React from "react";
import { MultiSelect } from "primereact/multiselect";
import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { TbSettings } from "react-icons/tb";
import { Dropdown } from "primereact/dropdown";
import "./tabelaCargas.css";

const PaginatorTable = ({ itensPerPage, setItensPerPage, setVisibleLeft }) => {
	const selectLines = { name: itensPerPage, code: itensPerPage };

	const showOpcaoPaginatot = (e) => {
		setItensPerPage(e.target.value.code);
		if (setVisibleLeft !== undefined) setVisibleLeft(false);
	};
	const optionsPaginate = [
		{ name: "10", code: "10" },
		{ name: "20", code: "20" },
		{ name: "50", code: "50" },
		{ name: "100", code: "100" },
		{ name: "500", code: "500" },
	];

	return (
		<Dropdown
			id="edit-linhas-tabela"
			className="dropLines"
			value={selectLines}
			options={optionsPaginate}
			onChange={showOpcaoPaginatot}
			optionLabel="name"
			placeholder="Itens por Página"
		/>
	);
};

export const headerTableFunction = (
	resetView,
	itensPerPage,
	setItensPerPage,
	selectedColumns,
	columns,
	onColumnToggle
) => (
	<Container fluid>
		<Row className="header-table">
			<Col className="col-paginator-itens">
				<PaginatorTable
					itensPerPage={itensPerPage}
					setItensPerPage={setItensPerPage}
				/>
			</Col>
			<Col className=" text-right">
				<InputGroup className="input-config-tab">
					<button type="submit" className="button-input-multiselect">
						<TbSettings className="header-table-icon-button" />
					</button>
					<MultiSelect
						id="Config-campos-tabela"
						fixedPlaceholder={true}
						dataKey="name"
						value={selectedColumns}
						options={columns}
						onChange={(e) => onColumnToggle(e)}
						optionLabel="description"
						placeholder="Configurar Tabela"
						filter={true}
						removeIcon
						filterPlaceholder="Filtrar por"
						className="class-multiSelect-filter"
					/>
				</InputGroup>
			</Col>
		</Row>
	</Container>
);

export const footerTableFunction = (
	previousPage,
	nextPage
	// page,
	// totalPages
) => {
	return (
		<Row>
			<Col className="footer-table mt-2 mb-2">
				<Button
					style={{ background: "#00652E", border: "none", color: "#FFFFFF" }}
					variant="outline-info"
					id="Botao-voltar-pag"
					onClick={previousPage}
				>
					<HiChevronDoubleLeft /> Página Anterior
				</Button>
				<Button
					variant="outline-info"
					id="Botao-proxima-pag"
					style={{ background: "#00652E", border: "none", color: "#FFFFFF" }}
					onClick={nextPage}
				>
					Página Seguinte <HiChevronDoubleRight />
				</Button>
			</Col>
			<Col sm={2} className="footer-table-totalPages">
				<h6>{/* Página {page} de {totalPages} */}</h6>
			</Col>
		</Row>
	);
};
