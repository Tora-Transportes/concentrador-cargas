import React from "react";
import {
	Container,
	Row,
	Col,
	Button,
	Modal,
	InputGroup,
	FormControl,
} from "react-bootstrap";
import { BsDownload, BsGear } from "react-icons/bs";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import NavbarNavigator from "../../Components/NavbarNavigator";
import CaptionStatusCarga from "../../Components/CaptionStatusCarga";

import TabelaCargas from "../../Components/TabelaCargas";

function VisualizarCargas({
	handleExportExcel,
	get_data,
	values,
	columns,
	LoadingComponent,
	handleToggleModal,
	displayColumns = [],
	dispatchColumns,
	activeModal = true,
	itensPerPage = 5,
	setItensPerPage,
	resetView,
	totalRegisters = null,
}) {
	return (
		<>
			<LoadingComponent />
			<NavbarNavigator />
			<Container fluid className="text-center mb-5">
				<Row>
					<Col>
						<h1 className="mb-5 mt-5">Grid de Cargas</h1>
					</Col>
				</Row>
				<Row>
					<Col className="text-start">
						<Button variant="outline-info" onClick={handleExportExcel}>
							Exportar <BsDownload />
						</Button>
						<Button variant="outline-info" onClick={handleToggleModal}>
							<BsGear /> Configurar visão
						</Button>
						<Button variant="outline-info" onClick={resetView}>
							Buscar novos campos
						</Button>
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
				</Row>
				<Row>
					<Col>
						<CaptionStatusCarga />
					</Col>
				</Row>
				<Row className="mt-5">
					<Col>
						{totalRegisters ? (
							<>
								Total de <b>{totalRegisters}</b> registros
							</>
						) : (
							""
						)}
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<TabelaCargas
							columns={columns.filter((i) =>
								displayColumns.find((c) => c.name === i.name)
							)}
							get_data={get_data}
							values={values}
						/>
					</Col>
				</Row>
				<Row>
					<Col sm={12}></Col>
				</Row>

				<Modal
					show={activeModal}
					onHide={handleToggleModal}
					backdrop="static"
					keyboard={false}
					size="lg"
				>
					<Modal.Header>
						<Modal.Title>
							Gerenciamento da Tabela <br />
							<Button
								variant=""
								className="ml-3"
								onClick={() => dispatchColumns({ type: "ENABLE_ALL" })}
							>
								Marcar todos
							</Button>
							<Button
								variant=""
								className="ml-3"
								onClick={() => dispatchColumns({ type: "DISABLE_ALL" })}
							>
								Desmarcar todos
							</Button>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{displayColumns.map((column) => (
							<InputGroup key={column.name}>
								<InputGroup.Checkbox
									name={column.name}
									checked={column.active}
									onChange={(e) => {
										if (e.target.checked) {
											dispatchColumns({
												type: "ENABLE_FIELD",
												name: column.name,
											});
										} else {
											dispatchColumns({
												type: "DISABLE_FIELD",
												name: column.name,
											});
										}
									}}
								/>
								<InputGroup.Text>
									<Button
										variant=""
										onClick={() =>
											dispatchColumns({
												type: "UP_FIELD",
												name: column.name,
											})
										}
									>
										<AiOutlineArrowUp />
									</Button>
								</InputGroup.Text>
								<InputGroup.Text>
									<Button
										variant=""
										onClick={() =>
											dispatchColumns({
												type: "DOWN_FIELD",
												name: column.name,
											})
										}
									>
										<AiOutlineArrowDown />
									</Button>
								</InputGroup.Text>
								<FormControl readOnly value={column.description} />
							</InputGroup>
						))}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleToggleModal}>
							Fechar
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		</>
	);
}

export default VisualizarCargas;
