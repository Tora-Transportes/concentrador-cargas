import { Button as ButtonReact } from "primereact/button";
import { AiFillFileExcel } from "react-icons/ai";
import { MdRefresh, MdOutlineSubtitles } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import "./util-opcoes-tabela.css";

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
			className="dropLines"
			value={selectLines}
			options={optionsPaginate}
			onChange={showOpcaoPaginatot}
			optionLabel="name"
			placeholder="Itens por Página"
		/>
	);
};

export const SideBarFuncition = ({
	itensPerPage,
	setItensPerPage,
	setModalShow,
	setModalShowExcel,
	setVisibleLeft,
	resetView,
}) => {
	const showLegendaCarga = () => {
		setModalShow(true);
		setVisibleLeft(false);
	};

	const downloadExel = () => {
		setModalShowExcel(true);
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
						label=" Legenda das Cargas "
						icon={<MdOutlineSubtitles className="icon-leg" />}
						onClick={() => showLegendaCarga()}
						className="font-sidebar w-100"
					/>
				</Col>
			)}
			<Col lg={12} className="text-center mb-2">
				<ButtonReact
					label=" Importar Tabela "
					icon={<AiFillFileExcel className="icon-import" />}
					onClick={() => downloadExel()}
					className="p-button-success w-100 font-sidebar"
				/>
			</Col>
			<Col lg={12} className="text-center mb-2">
				<ButtonReact
					label=" Redefinir Tabela "
					icon={<MdRefresh className="icon-redef" />}
					onClick={() => resetTable()}
					className="p-button-info w-100 font-sidebar"
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
