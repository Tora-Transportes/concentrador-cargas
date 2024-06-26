import React from "react";
import "./style.css";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IoMdHelpCircle } from "react-icons/io";
const animatedComponents = makeAnimated();

function ModalPreRequisito({
	prerequisitos,
	prerequisito,
	setPreRequisito,
	formik,
	open,
	handleOpen,
	handleAddPreRequisito,
	quantidade,
	setQuantidade,
	acoesRequisito,
}) {
	return (
		<>
			<div>
				<div className="notification-container">
					<button onClick={handleOpen} className="notification-button">
						Adicionar pré-requisitos
					</button>
					{formik.values.prerequisitos.length != 0 ? (
						<span className="notification-badge">
							{formik.values.prerequisitos.length}
						</span>
					) : (
						<></>
					)}
				</div>
				<OverlayTrigger
					key="tooltip-overlay-carga-app"
					placement="bottom"
					overlay={
						<Tooltip id={`tooltip-bottom`}>
							Caso não haja o requisito, solicitar superior para o cadastra-ló!{" "}
							<br />
							{""}
							Cargas {">"} Pré-requisitos
						</Tooltip>
					}
				>
					<span>
						<IoMdHelpCircle size={30} />
					</span>
				</OverlayTrigger>
			</div>
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar pré-requisitos</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Modal.Body>
						<Form>
							<Form.Group className="mb-3" controlId="validationFormikGrupos">
								<Form.Label>Pré-requisito</Form.Label>
								<Select
									id="prerequisito"
									name="prerequisito"
									placeholder="Selecionar"
									isLoading={prerequisitos.length == 0 ? true : false}
									options={prerequisitos}
									components={animatedComponents}
									onChange={(option) => setPreRequisito(option)}
									value={prerequisito}
								/>
							</Form.Group>
							{prerequisito && prerequisito.exige_quantidade == "1" ? (
								<Form.Group>
									<Form.Label>Quantidade</Form.Label>
									<Form.Control
										type="number"
										min={1}
										step={0.01}
										placeholder=" "
										name="quantidade"
										value={quantidade}
										onChange={(event) => {
											setQuantidade(event.target.value);
										}}
										required
									/>
								</Form.Group>
							) : (
								<></>
							)}
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleOpen}>
							Fechar
						</Button>
						<Button variant="primary" onClick={handleAddPreRequisito}>
							Salvar
						</Button>
					</Modal.Footer>
					<Modal.Body>
						<DataTable
							className="p-datatable-responsive-demoPermissoes"
							value={
								formik.values.prerequisitos.length != 0
									? formik.values.prerequisitos
									: []
							}
							paginator
							rows={60}
							paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
							emptyMessage="Sem requisitos selecionados"
							rowsPerPageOptions={[3, 5]}
							stripedRows
						>
							<Column field="nome" header="Nome" />
							<Column field="quantidade" header="Quantidade" />
							<Column
								header="Ações"
								body={acoesRequisito}
								className="table-column-acoes"
							/>
						</DataTable>
					</Modal.Body>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default ModalPreRequisito;
