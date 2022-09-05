import { Button as ButtonReact } from "primereact/button";
import { AiFillFileExcel } from "react-icons/ai";
import { MdRefresh, MdOutlineSubtitles } from "react-icons/md";
import { Col, Row } from "react-bootstrap";

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
						label="Legendas de cargas"
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
