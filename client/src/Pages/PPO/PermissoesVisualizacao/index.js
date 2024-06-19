/* eslint-disable no-prototype-builtins */
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import useLoadingScreen from "../../Components/LoadingScreen";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { Container, Row, Button, Form, Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
	nameBodyTemplate,
	opcoesTemplate,
	renderHeader,
	criadoBodyTemplate,
} from "./components/templateDataTable";
import swal from "sweetalert";
import * as Yup from "yup";
import ServicePPOPermissoesVisualizacao from "src/services/PPO/ServicePPOPermissoesVisualizacao";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const PermissoesVisualizacao = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [open, setOpen] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);
	const [changed, setChanged] = useState(false);
	const [globalFilter, setGlobalFilter] = useState();
	const [idEdit, setIdEdit] = useState(null);
	const [edit, setEdit] = useState({});
	const [users, setUsers] = useState([]);
	const [grupos, setGrupos] = useState([]);
	const [excludeGrupos, setExcludeGrupos] = useState([]);
	const [registros, setRegistros] = useState([]);
	const dadosTabela = useRef(null);

	function changedData() {
		setChanged(!changed);
	}

	function handleOpen() {
		setOpen(!open);
	}
	function handleOpenCreate() {
		setOpenCreate(!openCreate);
	}

	const GrupoSchema = Yup.object().shape({
		users: Yup.object()
			.shape({
				value: Yup.string().required("Usuário é um campo obrigatório"),
				label: Yup.string().required("Usuário é um campo obrigatório"),
				email: Yup.string()
					.email("Endereço de e-mail inválido")
					.required("E-mail é um campo obrigatório"),
			})
			.required("Usuário são campos obrigatórios"),
		grupos: Yup.array()
			.of(
				Yup.object().shape({
					value: Yup.number().required("Grupo é um campo obrigatório"),
					label: Yup.string().required("Grupo é um campo obrigatório"),
				})
			)
			.required("Grupos são campos obrigatórios"),
	});

	const GrupoSchemaEdit = Yup.object().shape({
		grupos: Yup.array()
			.of(
				Yup.object().shape({
					value: Yup.number().required("Grupo é um campo obrigatório"),
					label: Yup.string().required("Grupo é um campo obrigatório"),
				})
			)
			.required("Grupos são campos obrigatórios"),
	});

	const formikEdit = useFormik({
		initialValues: {
			grupos: null,
		},
		validationSchema: GrupoSchemaEdit,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await ServicePPOPermissoesVisualizacao.update(edit.id, values);
				swal("Sucesso", "Permissões atualizadas com sucesso!", "success");
				changedData();
				formikEdit.resetForm();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	const formik = useFormik({
		initialValues: {
			users: null,
			grupos: null,
		},
		validationSchema: GrupoSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await ServicePPOPermissoesVisualizacao.create(values);
				swal("Sucesso", "Registro criado com sucesso!", "success");
				handleOpenCreate();
				changedData();
				formik.resetForm();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	async function loadUsers() {
		return ServicePPOPermissoesVisualizacao.listAllUsers();
	}

	async function loadGrupos() {
		return ServicePPOPermissoesVisualizacao.listAllGrupos();
	}

	async function loadListUsers() {
		return ServicePPOPermissoesVisualizacao.list();
	}

	useEffect(() => {
		setLoading(true);
		Promise.all([loadUsers(), loadGrupos(), loadListUsers()])
			.then(function (values) {
				setUsers(values[0]);
				setGrupos(values[1]);
				setRegistros(values[2]);
			})
			.catch((error) => {
				console.error(error);
			});
		setLoading(false);
	}, []);

	useEffect(() => {
		setLoading(true);
		Promise.all([loadListUsers()])
			.then(function (values) {
				setRegistros(values[0]);
				const newData = values[0].filter((usuario) => usuario.oid === idEdit);
				try {
					const idsParaExcluir = newData[0].grupos.map(
						(grupo) => grupo.id_ppo_grupos
					);
					setExcludeGrupos(idsParaExcluir);
				} catch (error) {
					console.log();
				}

				setEdit(newData[0]);
			})
			.catch((error) => {
				console.error(error);
			});
		setLoading(false);
	}, [changed]);

	async function handleEditProduto(objeto) {
		setIdEdit(objeto.oid);
		setEdit(objeto);
		const idsParaExcluir = objeto.grupos.map((grupo) => grupo.id_ppo_grupos);
		setExcludeGrupos(idsParaExcluir);
		handleOpen();
	}
	async function handleDeleteGrupo(id, oid) {
		await ServicePPOPermissoesVisualizacao.deleteGrupo(id, oid);
		if (edit && edit.hasOwnProperty("grupos")) {
			// se for ultimo grupo fechar tela sozinha
			if (edit.grupos.length == 1) {
				handleOpen();
			}
		}
		changedData();
	}
	async function handleDelete(obj) {
		const observacao = await swal(
			"Ops!",
			`Tem certeza que deseja DELETAR o usuário : ${obj.nome}?`,
			"warning",
			{
				buttons: ["Não", true],
			}
		);
		if (observacao) {
			try {
				await ServicePPOPermissoesVisualizacao.deleteUser(obj.id);
				changedData();
				swal("Sucesso", "Usuário deletado!", "success");
			} catch (error) {
				console.log(error);
			}
		}
	}

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(rowData, swal, handleEditProduto, handleDelete);
	};

	const acoesGruposUsuarios = (rowData) => {
		return (
			<div className="opcoes-table">
				<Button
					variant="outline-danger"
					onClick={async (e) => {
						e.preventDefault();
						await handleDeleteGrupo(rowData.id, edit.id);
					}}
				>
					<IoIosCloseCircleOutline className="icon-des" />
					Deletar
				</Button>
			</div>
		);
	};

	const getRenderHeader = () => {
		return renderHeader(
			users,
			grupos,
			formik,
			globalFilter,
			setGlobalFilter,
			openCreate,
			handleOpenCreate
		);
	};

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>
						Editando Usuário :{" "}
						{edit && edit.hasOwnProperty("nome") ? edit.nome : ""}
					</Modal.Title>
				</Modal.Header>
				<Form className="p-2">
					<Form.Group className="mb-3" controlId="validationFormikGrupos">
						<Form.Label>Grupos</Form.Label>
						<Select
							id="grupos"
							name="grupos"
							isMulti
							placeholder="Selecionar Grupos"
							options={grupos.filter(
								(opcao) => !excludeGrupos.includes(opcao.value)
							)}
							components={animatedComponents}
							onChange={(option) => formikEdit.setFieldValue("grupos", option)}
							value={formikEdit.values.grupos}
						/>
						{formikEdit.errors.grupos && formikEdit.touched.grupos && (
							<div style={{ color: "red" }}>{formikEdit.errors.grupos}</div>
						)}
					</Form.Group>
				</Form>
				<Modal.Body>
					<DataTable
						className="p-datatable-responsive-demoPermissoes"
						value={edit && edit.hasOwnProperty("grupos") ? edit.grupos : []}
						paginator
						rows={60}
						paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
						emptyMessage="Não foram encontrados resultados nessa busca."
						rowsPerPageOptions={[3, 5]}
						stripedRows
					>
						<Column
							field="nome"
							header="Nome"
							bodyStyle={{ color: "red" }}
							//className="table-column-nome"
						/>
						<Column
							body={criadoBodyTemplate}
							field="cod_usu_create"
							header="Criado por:"
							className="table-column-email"
						/>

						<Column
							header="Ações"
							body={acoesGruposUsuarios}
							className="table-column-acoes"
						/>
					</DataTable>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleOpen}>
						Fechar
					</Button>
					<Button variant="primary" onClick={formikEdit.handleSubmit}>
						Salvar
					</Button>
				</Modal.Footer>
			</Modal>
			<Container className="pagina-produtos">
				<Row>
					<h1 className="class-title-produto">Permissões Visualização</h1>
					<div className="datatable-responsive-demoPermissoes">
						<DataTable
							className="p-datatable-responsive-demoPermissoes"
							ref={dadosTabela}
							globalFilter={globalFilter}
							value={registros}
							header={getRenderHeader()}
							paginator
							rows={60}
							paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
							emptyMessage="Não foram encontrados resultados nessa busca."
							rowsPerPageOptions={[80, 100]}
							stripedRows
						>
							<Column
								body={nameBodyTemplate}
								field="nome"
								header="Nome"
								bodyStyle={{ color: "red" }}
								//className="table-column-nome"
							/>
							<Column
								field="email"
								header="Email"
								bodyStyle={{ color: "red" }}
								//className="table-column-nome"
							/>
							<Column
								body={criadoBodyTemplate}
								field="cod_usu_create"
								header="Criado por:"
								className="table-column-email"
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
		</>
	);
};

export default PermissoesVisualizacao;
