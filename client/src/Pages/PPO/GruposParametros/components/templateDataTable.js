import React, { useState } from "react";
import { BsCheckLg, BsPencilSquare } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, Form, InputGroup, FormControl, Modal } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";

export const renderHeader = (
	formik,
	globalFilter,
	setGlobalFilter,
	atributos,
	parametros
) => {
	const [open, setOpen] = useState(false);
	function handleOpen() {
		setOpen(!open);
	}

	return (
		<div className="header-table-produto">
			<Button
				onClick={handleOpen}
				style={{ backgroundColor: "#00652e", borderColor: "#00652e" }}
			>
				<MdAddCircleOutline
					style={{ marginBottom: "3px", marginRight: "3px" }}
				/>
				Adicionar
			</Button>
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar Parâmetro ao Grupo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput0">
							<Form.Label>Parâmetro:</Form.Label>
							<Form.Select
								aria-label="Default select example"
								name="parametro_id"
								onChange={formik.handleChange}
								value={formik.values.parametro_id}
							>
								<option>Selecione um parâmetro</option>
								{parametros.map((objeto, index) => (
									<option key={index} value={objeto.id}>
										{objeto.nome}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Operador Lógico:</Form.Label>
							<Form.Select
								aria-label="Default select example"
								name="operador_logico_primario"
								onChange={formik.handleChange}
								value={formik.values.operador_logico_primario}
							>
								<option>Selecione operador lógico primário</option>
								<option value=">">Maior que</option>
								<option value="<">Menor que</option>
								<option value=">=">Maior ou igual</option>
								<option value="<=">Menor ou igual</option>
								<option value="=">Igual</option>
								<option value="*">Multiplicar</option>
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
							<Form.Label>Valor Primário:</Form.Label>
							<Form.Control
								name="valor_primario"
								onChange={formik.handleChange}
								value={formik.values.valor_primario}
								type="text"
								placeholder="10.000"
								autoFocus
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
							<Form.Label>Comparar com:</Form.Label>
							<Form.Select
								aria-label="Default select example"
								name="tabela"
								onChange={formik.handleChange}
								value={formik.values.tabela}
							>
								<option>Selecione um comparador</option>
								{atributos.map((objeto, index) => (
									<option
										key={index}
										value={`${objeto.id_rotulo};${objeto.tabela};${objeto.coluna}`}
									>
										{objeto.rotulo}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
							<Form.Check
								type="switch"
								name="faixa_valores"
								label="Faixa de Valores"
								onChange={formik.handleChange}
								checked={formik.values.faixa_valores}
								value={formik.values.faixa_valores}
							/>
						</Form.Group>
						{formik.values.faixa_valores ? (
							<>
								<Form.Group
									className="mb-3"
									controlId="exampleForm.ControlInput5"
								>
									<Form.Label>Operador Lógico Secundário:</Form.Label>
									<Form.Select
										aria-label="Default select example"
										name="operador_logico_secundaria"
										onChange={formik.handleChange}
										value={formik.values.operador_logico_secundaria}
									>
										<option></option>
										<option value=">">Maior que</option>
										<option value="<">Menor que</option>
										<option value=">=">Maior ou igual</option>
										<option value="<=">Menor ou igual</option>
										<option value="=">Igual</option>
										<option value="*">Multiplicar</option>
									</Form.Select>
								</Form.Group>
								<Form.Group
									className="mb-3"
									controlId="exampleForm.ControlInput6"
								>
									<Form.Label>Valor Secundário:</Form.Label>
									<Form.Control
										type="text"
										name="valor_secundario"
										onChange={formik.handleChange}
										value={formik.values.valor_secundario}
										placeholder="10.000"
										autoFocus
									/>
								</Form.Group>
							</>
						) : (
							<></>
						)}
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
							<Form.Label>Prêmio:</Form.Label>
							<Form.Control
								name="premio"
								onChange={formik.handleChange}
								value={formik.values.premio}
								type="text"
								placeholder="10.000"
								autoFocus
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleOpen}>
						Fechar
					</Button>
					<Button variant="primary" onClick={formik.handleSubmit}>
						Salvar
					</Button>
				</Modal.Footer>
			</Modal>
			<div className="header-table-filter-produto">
				<InputGroup>
					<FormControl
						placeholder="Pesquisar parâmetros"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
					<i className="pi pi-search" />
				</InputGroup>
			</div>
		</div>
	);
};

export const opcoesTemplate = (
	rowData,
	swal,
	handleEditProduto,
	handleDelete,
	handleEnableProduto
) => {
	return (
		<div className="opcoes-table">
			{rowData.ativo !== false ? (
				<>
					<Button
						variant="outline-warning"
						onClick={(e) => {
							e.preventDefault();
							handleEditProduto(rowData, rowData.id);
						}}
					>
						<BsPencilSquare className="icon-editar" /> Editar
					</Button>
					<Button
						variant="outline-danger"
						onClick={(e) => {
							e.preventDefault();
							handleDelete(rowData.parametro_nome, rowData.id);
						}}
					>
						<IoIosCloseCircleOutline className="icon-des" />
						Desativar
					</Button>
				</>
			) : (
				<>
					<Button
						variant="outline-info"
						onClick={(e) => {
							e.preventDefault();
							handleEnableProduto(rowData.id);
						}}
					>
						<BsCheckLg fontSize={12} />
						Ativar
					</Button>
				</>
			)}
		</div>
	);
};

export const situacaoBodyTemplate = (rowData) => {
	let colorSpan = "#000";
	let situacao = "Ativo";
	if (rowData.ativo !== true) {
		situacao = "Inativo";
		colorSpan = "red";
	}
	return (
		<React.Fragment>
			<span style={{ color: colorSpan }}>{situacao}</span>
		</React.Fragment>
	);
};

export const usuarioBodyTemplate = (rowData) => {
	const colorSpan = rowData.ativo !== true ? "red" : "#000";
	return <span style={{ color: colorSpan }}>{rowData.parametro_nome}</span>;
};

export const faixaBodyTemplate = (rowData) => {
	const label = rowData.faixa_valores !== false ? "Sim" : "Não";
	return <span>{label}</span>;
};

export const atributoBodyTemplate = (rowData) => {
	return <span>{`${rowData.tabela}.${rowData.campo}`}</span>;
};

export const criadoBodyTemplate = (rowData) => {
	const [data, time] = rowData.created_at?.split("T");
	return (
		<span style={{ color: "#000" }}>{`${rowData.cod_usu_create} | ${data
			.split("-")
			.reverse()
			.join("-")} às ${time.split(".")[0]}`}</span>
	);
};

export const atualizadoBodyTemplate = (rowData) => {
	try {
		const [data, time] = rowData.updated_at?.split("T");
		return (
			<span style={{ color: "#000" }}>{`${rowData.cod_usu_update} | ${data
				.split("-")
				.reverse()
				.join("-")} às ${time.split(".")[0]}`}</span>
		);
	} catch (error) {
		return <>-</>;
	}
};
