import React, { useEffect, useRef, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { useParams } from "react-router-dom";
import "./styles.css";
import {
	Container,
	Row,
	Button,
	Form,
	Modal,
	InputGroup,
} from "react-bootstrap";
import { useFormik } from "formik";
import ServicePPOGruposParametros from "../../../services/PPO/ServicePPOGruposParametros";
import ServicePPO from "src/services/PPO/ServicePPO";
import ServicePPOParametros from "src/services/PPO/ServicePPOParametros";
import swal from "sweetalert";
//import { getClaims } from "../../MicrosoftAuthentication";
import useLoadingScreen from "../../Components/LoadingScreen";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
	opcoesTemplate,
	situacaoBodyTemplate,
	criadoBodyTemplate,
	atualizadoBodyTemplate,
	renderHeader,
	faixaBodyTemplate,
	premioBodyTemplate,
	multiplicarBodyTemplate,
	//atributoBodyTemplate,
} from "./components/templateDataTable";
import * as Yup from "yup";

const GrupoParametroSchema = Yup.object().shape({
	parametro_id: Yup.string().required("parâmetro é um campo obrigatório"),
	tabela: Yup.string().required("comparador é um campo obrigatório"),
	operador_logico_primario: Yup.string().required(
		"operador lógico primário é um campo obrigatório"
	),
	valor_primario: Yup.string().required(
		"valor primário é um campo obrigatório"
	),
	premio: Yup.number().required("prêmio é um campo obrigatório"),
});

const GruposParametros = () => {
	const { id } = useParams();
	const searchParams = new URLSearchParams(document.location.search);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [gruposParametros, setGruposParametros] = useState([]);
	const [atributos, setAtributos] = useState([]);
	const [parametros, setParametros] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();
	const [open, setOpen] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);
	const [idEdit, setIdEdit] = useState(null);
	function handleOpen() {
		setOpen(!open);
	}

	function handleOpenCreate() {
		setOpenCreate(!openCreate);
	}

	const dadosTabela = useRef(null);

	const formik = useFormik({
		initialValues: {
			grupo_id: id,
			parametro_id: "",
			de_para_rotulo_id: "",
			operador_logico_primario: "",
			valor_primario: "",
			operador_logico_secundaria: "",
			valor_secundario: "",
			premio: 0,
			tabela: "",
			campo: "",
			faixa_valores: false,
			multiplicar_premio: false,
			multiplicar_premio_por_comparador: false,
			comparador_multiplicador_id: null,
			ativo: true,
		},
		validationSchema: GrupoParametroSchema,
		onChange: async (values) => {
			console.log(values);
		},

		onSubmit: async (values) => {
			const tabelaCampo = values.tabela.split(";");
			values.de_para_rotulo_id = tabelaCampo[0];
			values.tabela = tabelaCampo[1];
			values.campo = tabelaCampo[2];
			if (!values.faixa_valores) {
				values.operador_logico_secundaria = "";
				values.valor_secundario = "";
			}
			setLoading(true);
			try {
				await ServicePPOGruposParametros.create(values);
				loadListagem();
				formik.resetForm();
				handleOpenCreate();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	async function handleDelete(nome, id) {
		const observacao = await swal(
			"Ops!",
			`Tem certeza que deseja DESATIVAR o parâmetro ${nome}?`,
			"warning",
			{
				buttons: ["Não", true],
			}
		);
		if (observacao) {
			try {
				await ServicePPOGruposParametros.update(id, { ativo: 0 });
				await loadListagem();
				swal("Sucesso", "Parâmetro desativado!", "success");
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function handleEnableProduto(id) {
		try {
			await ServicePPOGruposParametros.update(id, { ativo: 1 });
			await loadListagem();
			swal("Sucesso", "Parâmetro ativado!", "success");
		} catch (error) {
			console.log(error);
		}
	}

	async function handleEditProduto(objeto, id) {
		setIdEdit(id);
		let premio = objeto.premio.toString().split(".");
		if (premio.length > 1) {
			if (premio[1].length == 1) {
				objeto.premio = `${objeto.premio}0`;
			}
		}
		formik.values.ativo = objeto.ativo;
		formik.values.grupo_id = objeto.grupo_id;
		formik.values.parametro_id = objeto.parametro_id;
		formik.values.operador_logico_primario = objeto.operador_logico_primario;
		formik.values.valor_primario = objeto.valor_primario;
		formik.values.operador_logico_secundaria =
			objeto.operador_logico_secundaria;
		formik.values.valor_secundario = objeto.valor_secundario;
		formik.values.premio = objeto.premio;
		formik.values.tabela = `${objeto.de_para_rotulo_id};${objeto.tabela};${objeto.campo}`;
		formik.values.de_para_rotulo_id = objeto.de_para_rotulo_id;
		formik.values.campo = objeto.campo;
		formik.values.faixa_valores = objeto.faixa_valores;
		formik.values.multiplicar_premio = objeto.multiplicar_premio;
		formik.values.multiplicar_premio_por_comparador =
			objeto.multiplicar_premio_por_comparador;
		formik.values.comparador_multiplicador_id =
			objeto.comparador_multiplicador_id;
		formik.values.ativo = objeto.ativo;
		handleOpen();
	}

	async function submitEdit() {
		try {
			const tabelaCampo = formik.values.tabela.split(";");
			formik.values.de_para_rotulo_id = tabelaCampo[0];
			formik.values.tabela = tabelaCampo[1];
			formik.values.campo = tabelaCampo[2];
			if (!formik.values.faixa_valores) {
				formik.values.operador_logico_secundaria = "";
				formik.values.valor_secundario = "";
			}
			await ServicePPOGruposParametros.update(idEdit, formik.values);
			formik.resetForm();
			handleOpen();
			formik.resetForm();
			await loadListagem();
			formik.resetForm();
			swal("Sucesso", "Parâmetro atualizado!", "success");
		} catch (error) {
			console.log(error);
		}
	}

	async function listagem() {
		return ServicePPOGruposParametros.list(id);
	}

	async function loadListagem() {
		const gpparms = await ServicePPOGruposParametros.list(id);
		setGruposParametros(gpparms.data.data);
	}

	async function listaAtributos() {
		return ServicePPO.atributos();
	}

	async function listaParametros() {
		return ServicePPOParametros.list();
	}

	useEffect(() => {
		Promise.all([listagem(), listaAtributos(), listaParametros()]).then(
			function (values) {
				setGruposParametros(values[0].data.data);
				setAtributos(values[1].data.data);
				setParametros(values[2].data.data);
			}
		);
	}, []);

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(
			rowData,
			swal,
			handleEditProduto,
			handleDelete,
			handleEnableProduto
		);
	};

	const getRenderHeader = () => {
		return renderHeader(
			formik,
			openCreate,
			handleOpenCreate,
			globalFilter,
			setGlobalFilter,
			atributos,
			parametros
		);
	};

	return (
		<div className="class-body-produtos">
			<LoadingScreen />
			<Menusuperior />
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>Editando Parâmetro do Grupo</Modal.Title>
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
					<Button variant="primary" onClick={submitEdit}>
						Salvar
					</Button>
				</Modal.Footer>
			</Modal>
			<Container className="pagina-produtos">
				<Row>
					<h1 className="class-title-produto">
						Parâmetros do Grupo : {searchParams.get("nome")}{" "}
					</h1>
					<div className="datatable-responsive-demoPermissoes">
						<DataTable
							className="p-datatable-responsive-demoPermissoes"
							ref={dadosTabela}
							globalFilter={globalFilter}
							value={gruposParametros}
							header={getRenderHeader()}
							paginator
							rows={60}
							paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
							emptyMessage="Não foram encontrados resultados nessa busca."
							rowsPerPageOptions={[5, 10, 25, 50, 100]}
							stripedRows
						>
							<Column
								field="parametro_nome"
								header="Nome Parâmetro"
								style={{ textAlign: "center" }}
							/>
							<Column
								field="operador_logico_primario"
								header="Operador Lógico P"
								style={{ textAlign: "center" }}
							/>
							<Column
								field="valor_primario"
								header="Valor P"
								//className="table-column-nome"
							/>
							<Column
								body={faixaBodyTemplate}
								field="faixa_valores"
								header="Faixa de Valores"
								style={{ textAlign: "center" }}
							/>
							<Column
								body={multiplicarBodyTemplate}
								field="multiplicar_premio"
								header="Multiplicar Prêmio"
								style={{ textAlign: "center" }}
							/>
							<Column
								field="operador_logico_secundaria"
								header="Operador Lógico S"
								style={{ textAlign: "center" }}
							/>
							<Column
								field="valor_secundario"
								header="Valor S"
								//className="table-column-nome"
							/>
							<Column
								body={premioBodyTemplate}
								field="premio"
								header="Valor Prêmio"
								//className="table-column-nome"
							/>
							<Column
								body={criadoBodyTemplate}
								field="usuario"
								header="Criado por:"
								className="table-column-email"
							/>
							<Column
								body={atualizadoBodyTemplate}
								field="usuario"
								header="Atualizado por:"
								className="table-column-email"
							/>
							<Column
								body={situacaoBodyTemplate}
								field="ativo"
								className="table-column-permissoes"
								header="Situação"
								style={{ textAlign: "center" }}
							/>
							<Column
								header="Ações"
								body={getOpcoesTemplate}
								className="table-column-acoes"
							/>
						</DataTable>
					</div>
				</Row>
			</Container>
		</div>
	);
};

export default GruposParametros;
