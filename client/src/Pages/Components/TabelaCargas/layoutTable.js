import React from "react";
import { MultiSelect } from "primereact/multiselect";
import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import { Button as ButtonReact } from "primereact/button";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { AiFillFileExcel } from "react-icons/ai";
import { MdRefresh, MdOutlineSubtitles } from "react-icons/md";
import { TbSettings } from "react-icons/tb";

const PaginatorTable = ({ itensPerPage, setItensPerPage, setVisibleLeft }) => {
	const showOpcaoPaginatot = (e) => {
		setItensPerPage(e.target.value);
		if (setVisibleLeft !== undefined) setVisibleLeft(false);
	};
	return (
		<select
			id="edit-linhas-tabela"
			className="btn"
			value={itensPerPage}
			onChange={(e) => showOpcaoPaginatot(e)}
		>
			<option value="10">👀 10</option>
			<option value="20">👀 20</option>
			<option value="50">👀 50</option>
			<option value="100">👀 100</option>
			<option value="500">👀 500</option>
		</select>
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
			<Col className="text-center">
				<PaginatorTable
					itensPerPage={itensPerPage}
					setItensPerPage={setItensPerPage}
				/>
			</Col>
			<Col className=" text-right">
				<InputGroup className="justify-content-center">
					<button type="submit" className="button-input-multiselect">
						<TbSettings className="header-table-icon-button" />
					</button>
					<MultiSelect
						//display="chip"
						id="Config-campos-tabela"
						fixedPlaceholder={true}
						dataKey="name"
						value={selectedColumns}
						options={columns}
						onChange={(e) => onColumnToggle(e)}
						optionLabel="description"
						placeholder="Configurar tabela"
						filter={true}
						removeIcon
						filterPlaceholder="Procurar"
						className="p-column-filter"
					/>
				</InputGroup>
			</Col>
		</Row>
	</Container>
);

export const SideBarFuncition = ({
	itensPerPage,
	setItensPerPage,
	setModalShow,
	setVisibleLeft,
	handleExportExcel,
	resetView,
}) => {
	const showLegendaCarga = () => {
		setModalShow(true);
		setVisibleLeft(false);
	};

	const downloadExel = () => {
		handleExportExcel();
		setVisibleLeft(false);
	};

	const resetTable = () => {
		setVisibleLeft(false);
		resetView();
	};

	return (
		<Row>
			{setModalShow !== undefined && (
				<Col lg={12} className="text-center mb-2">
					<ButtonReact
						label="Legenda carga"
						icon={<MdOutlineSubtitles />}
						onClick={() => showLegendaCarga()}
						className=" w-100"
					/>
				</Col>
			)}
			<Col lg={12} className="text-center mb-2">
				<ButtonReact
					label=" Excel "
					icon={<AiFillFileExcel />}
					onClick={() => downloadExel()}
					className="p-button-success w-100"
				/>
			</Col>
			<Col lg={12} className="text-center mb-2">
				<ButtonReact
					label=" Redefinir tabela "
					icon={<MdRefresh />}
					onClick={() => resetTable()}
					className="p-button-info w-100"
				/>
			</Col>
			<Col lg={12} className="text-center mb-2 paginator-table-col">
				<PaginatorTable
					itensPerPage={itensPerPage}
					setItensPerPage={setItensPerPage}
					setVisibleLeft={setVisibleLeft}
				/>
			</Col>
		</Row>
	);
};

export const footerTableFunction = (previousPage, nextPage) => {
	return (
		<Col className="footer-table">
			<Button
				style={{ background: "#00652E", border: "none", color: "#FFFFFF" }}
				variant="outline-info"
				id="Botao-voltar-pag"
				onClick={previousPage}
			>
				<HiChevronDoubleLeft /> Voltar paginação
			</Button>
			<Button
				variant="outline-info"
				id="Botao-proxima-pag"
				style={{ background: "#00652E", border: "none", color: "#FFFFFF" }}
				onClick={nextPage}
			>
				Proxíma paginação <HiChevronDoubleRight />
			</Button>
		</Col>
	);
};
