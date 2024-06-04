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
	permissaoBodyTemplate,
} from "./components/templateDataTable";
import swal from "sweetalert";
import * as Yup from "yup";
import ServicePPOEventosPermissoes from "src/services/PPO/ServicePPOEventosPermissoes";
import Select from "react-select";

const AprovacaoSupervisor = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [open, setOpen] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);
	const [changed, setChanged] = useState(false);
	const [globalFilter, setGlobalFilter] = useState();
	const [idEdit, setIdEdit] = useState(null);
	const [edit, setEdit] = useState({});
	const [users, setUsers] = useState([]);
	const [registros, setRegistros] = useState([]);
	const dadosTabela = useRef(null);

	const permissoes = [
		{ value: 0, label: "Supervisor" },
		{ value: 1, label: "Gerente/Diretor" },
	];

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
		permissao: Yup.object()
			.shape({
				value: Yup.string().required("Permissão é um campo obrigatório"),
				label: Yup.string().required("Permissão é um campo obrigatório"),
			})
			.required("Permissão são campos obrigatórios"),
	});

	const GrupoSchemaEdit = Yup.object().shape({
		permissao: Yup.object()
			.shape({
				value: Yup.string().required("Permissão é um campo obrigatório"),
				label: Yup.string().required("Permissão é um campo obrigatório"),
			})
			.required("Permissão são campos obrigatórios"),
	});

	const formikEdit = useFormik({
		initialValues: {
			permissao: null,
		},
		validationSchema: GrupoSchemaEdit,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await ServicePPOEventosPermissoes.update(edit.oid, values);
				swal("Sucesso", "Permissões atualizadas com sucesso!", "success");
				handleOpen();
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
			permissao: null,
		},
		validationSchema: GrupoSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await ServicePPOEventosPermissoes.create(values);
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
		return ServicePPOEventosPermissoes.listAllUsers();
	}

	async function loadListUsers() {
		return ServicePPOEventosPermissoes.list();
	}

	useEffect(() => {
		setLoading(true);
		Promise.all([loadUsers(), loadListUsers()])
			.then(function (values) {
				setUsers(values[0]);
				setRegistros(values[1]);
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
		formikEdit.setFieldValue("permissao", permissoes[objeto.permissao]);
		handleOpen();
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
				await ServicePPOEventosPermissoes.deleteUser(obj.oid);
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

	const getRenderHeader = () => {
		return renderHeader(
			users,
			permissoes,
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
				<Modal.Body>
					<Form className="p-2">
						<Form.Group className="mb-3" controlId="validationFormikPermissao">
							<Form.Label>Permissão</Form.Label>
							<Select
								id="permissao"
								name="permissao"
								placeholder="Selecionar Permissão"
								options={permissoes}
								onChange={(option) =>
									formikEdit.setFieldValue("permissao", option)
								}
								value={formikEdit.values.permissao}
							/>
							{formikEdit.errors.permissao && formikEdit.touched.permissao && (
								<div style={{ color: "red" }}>
									{formikEdit.errors.permissao}
								</div>
							)}
						</Form.Group>
					</Form>
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
					<h1 className="class-title-produto">Permissões Aprovação Eventos</h1>
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
								body={permissaoBodyTemplate}
								field="permissao"
								header="Permissão"
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

export default AprovacaoSupervisor;
