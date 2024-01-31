import React from "react";
import { BsCheckLg, BsPencilSquare } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, Form, InputGroup, FormControl, Modal } from "react-bootstrap";
import { MdAddCircleOutline } from "react-icons/md";

export const renderHeader = (
	formik,
	open,
	handleOpen,
	globalFilter,
	setGlobalFilter,
	atributos,
	parametros
) => {
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
								isInvalid={!!formik.errors.parametro_id}
								placeholder="Selecione um parâmetro"
							>
								<option></option>
								{parametros.map((objeto, index) => (
									<option key={index} value={objeto.id}>
										{objeto.nome}
									</option>
								))}
							</Form.Select>
							<Form.Control.Feedback type="invalid">
								{formik.errors.parametro_id}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Operador Lógico:</Form.Label>
							<Form.Select
								aria-label="Default select example"
								name="operador_logico_primario"
								onChange={formik.handleChange}
								value={formik.values.operador_logico_primario}
								isInvalid={!!formik.errors.operador_logico_primario}
								placeholder="Selecione operador lógico primário"
							>
								<option></option>
								<option value=">">Maior que</option>
								<option value="<">Menor que</option>
								<option value=">=">Maior ou igual</option>
								<option value="<=">Menor ou igual</option>
								<option value="=">Igual</option>
								<option value="*">Multiplicar</option>
							</Form.Select>
							<Form.Control.Feedback type="invalid">
								{formik.errors.operador_logico_primario}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="validationFormikNomeEdit">
							<Form.Label>Valor Primário:</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="10.000"
									aria-describedby="inputGroupPrepend"
									name="valor_primario"
									value={formik.values.valor_primario}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.valor_primario}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.valor_primario}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
							<Form.Label>Comparar com:</Form.Label>
							<Form.Select
								aria-label="Default select example"
								name="tabela"
								placeholder="Selecione um comparador"
								onChange={formik.handleChange}
								value={formik.values.tabela}
								isInvalid={!!formik.errors.tabela}
							>
								<option></option>
								{atributos.map((objeto, index) => (
									<option
										key={index}
										value={`${objeto.id_rotulo};${objeto.tabela};${objeto.coluna}`}
									>
										{objeto.rotulo}
									</option>
								))}
							</Form.Select>
							<Form.Control.Feedback type="invalid">
								{formik.errors.tabela}
							</Form.Control.Feedback>
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
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
							<Form.Check
								type="switch"
								name="multiplicar_premio"
								label="Multiplicar Prêmio"
								onChange={formik.handleChange}
								checked={formik.values.multiplicar_premio}
								value={formik.values.multiplicar_premio}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput90">
							<Form.Check
								type="switch"
								name="multiplicar_premio_por_comparador"
								label="Multiplicar Prêmio usando comparador"
								onChange={formik.handleChange}
								checked={formik.values.multiplicar_premio_por_comparador}
								value={formik.values.multiplicar_premio_por_comparador}
							/>
						</Form.Group>
						{formik.values.multiplicar_premio_por_comparador ? (
							<Form.Group
								className="mb-3"
								controlId="exampleForm.ControlInput3"
							>
								<Form.Label>Multiplicar Por:</Form.Label>
								<Form.Select
									aria-label="Default select example"
									name="comparador_multiplicador_id"
									placeholder="Selecione um comparador"
									onChange={formik.handleChange}
									value={formik.values.comparador_multiplicador_id}
									isInvalid={!!formik.errors.comparador_multiplicador_id}
								>
									<option></option>
									{atributos.map((objeto, index) => (
										<option key={index} value={objeto.id_rotulo}>
											{objeto.rotulo}
										</option>
									))}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{formik.errors.comparador_multiplicador_id}
								</Form.Control.Feedback>
							</Form.Group>
						) : (
							<></>
						)}
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
						<Form.Group className="mb-3" controlId="validationFormikPremio">
							<Form.Label>Prêmio:</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="10.000"
									aria-describedby="inputGroupPrepend"
									name="premio"
									value={formik.values.premio}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.premio}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.premio}
								</Form.Control.Feedback>
							</InputGroup>
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

export const multiplicarBodyTemplate = (rowData) => {
	const label = rowData.multiplicar_premio !== false ? "Sim" : "Não";
	return <span>{label}</span>;
};

export const atributoBodyTemplate = (rowData) => {
	return <span>{`${rowData.tabela}.${rowData.campo}`}</span>;
};

export const premioBodyTemplate = (rowData) => {
	let premio = rowData.premio.toString().split(".");
	if (premio.length > 1) {
		if (premio[1].length == 1) {
			return <span>{`${rowData.premio}0`}</span>;
		} else {
			return <span>{`${rowData.premio}`}</span>;
		}
	} else {
		return <span>{`${rowData.premio}`}</span>;
	}
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
