import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import useLoadingScreen from "../../Components/LoadingScreen";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import {
	Container,
	Row,
	Button,
	Form,
	Modal,
	InputGroup,
} from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
	nameBodyTemplate,
	opcoesTemplate,
	usuarioBodyTemplate,
	renderHeader,
	criadoBodyTemplate,
	termoBodyTemplate,
} from "./components/templateDataTable";
import swal from "sweetalert";
import ServicePPOGrupos from "src/services/PPO/ServicePPOGrupos";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

const GrupoSchema = Yup.object().shape({
	nome: Yup.string().required("nome é um campo obrigatório"),
	empresa: Yup.string().required("empresa é um campo obrigatório"),
	filial: Yup.string().required("filial é um campo obrigatório"),
	cod_filial: Yup.string().required("cod filial é um campo obrigatório"),
});

const Grupos = () => {
	const history = useHistory();
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [parametros, setParametros] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();
	const dadosTabela = useRef(null);
	const [open, setOpen] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);
	const [idEdit, setIdEdit] = useState(null);
	const inputFile = useRef(null);
	function handleOpen() {
		setOpen(!open);
	}
	function handleOpenCreate() {
		setOpenCreate(!openCreate);
	}

	async function loadParametros() {
		setLoading(true);
		ServicePPOGrupos.list().then(({ data }) => {
			setParametros(data.data);
		});
		setLoading(false);
	}

	const formik = useFormik({
		initialValues: {
			nome: "",
			empresa: "",
			filial: "",
			cod_filial: "",
		},
		validationSchema: GrupoSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				if (inputFile.current) {
					console.log(inputFile.current);
					const files = inputFile.current.files;
					if (files.length === 0) {
						swal("Ops!", "Nenhum arquivo foi selecionado.", "error");
					} else {
						await ServicePPOGrupos.create(files[0], values);
						await loadParametros();
						handleOpenCreate();
						swal("Sucesso!", "O grupo foi cadastrado", "success");
						formik.resetForm();
						inputFile.current.value = "";
					}
				}
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});
	useEffect(() => {
		loadParametros();
		setGlobalFilter("");
	}, []);

	async function handleRedirect(id, nome) {
		history.push(`/ppo/grupos/${id}/parametros?nome=${nome}`);
	}

	async function handleDelete(nome, id) {
		const observacao = await swal(
			"Ops!",
			`Tem certeza que deseja DELETAR o grupo ${nome}?`,
			"warning",
			{
				buttons: ["Não", true],
			}
		);
		if (observacao) {
			try {
				await ServicePPOGrupos.delete({ id });
				swal("Sucesso", "Grupo deletado!", "success");
				await loadParametros();
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function submitEdit() {
		try {
			if (inputFile.current) {
				console.log(inputFile.current);
				const files = inputFile.current.files;
				if (files.length === 0) {
					await ServicePPOGrupos.update(idEdit, false, null, formik.values);
					swal("Sucesso", "Grupo atualizado!", "success");
					handleOpen();
					await loadParametros();
				} else {
					await ServicePPOGrupos.update(idEdit, true, files[0], formik.values);
					swal("Sucesso", "Grupo atualizado!", "success");
					handleOpen();
					await loadParametros();
				}
			}
			formik.resetForm();
		} catch (error) {
			console.log(error);
		}
	}

	async function handleEditProduto(objeto, id) {
		setIdEdit(id);
		formik.values.nome = objeto.nome;
		formik.values.empresa = objeto.empresa;
		formik.values.filial = objeto.filial;
		formik.values.cod_filial = objeto.cod_filial;
		handleOpen();
	}

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(
			rowData,
			swal,
			handleEditProduto,
			handleDelete,
			handleRedirect
		);
	};

	const getRenderHeader = () => {
		return renderHeader(
			inputFile,
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
					<Modal.Title>Editando Grupo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="validationFormikNomeEdit">
							<Form.Label>Nome</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Nome"
									aria-describedby="inputGroupPrepend"
									name="nome"
									value={formik.values.nome}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.nome}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.nome}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="validationFormikEmpresaEdit"
						>
							<Form.Label>Empresa</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Empresa"
									aria-describedby="inputGroupPrepend"
									name="empresa"
									value={formik.values.empresa}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.empresa}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.empresa}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group className="mb-3" controlId="validationFormikFilialEdit">
							<Form.Label>Filial</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Filial"
									aria-describedby="inputGroupPrepend"
									name="filial"
									value={formik.values.filial}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.filial}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.filial}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="validationFormikCodFilialEdit"
						>
							<Form.Label>Cod. Filial</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Cod. Filial"
									aria-describedby="inputGroupPrepend"
									name="cod_filial"
									value={formik.values.cod_filial}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.cod_filial}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.cod_filial}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group className="mb-3" controlId="validationFormikTermo">
							<Form.Label>Termo</Form.Label>
							<Form.Control
								type="file"
								accept=".pdf"
								required
								ref={inputFile}
							/>
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
					<h1 className="class-title-produto">Grupos</h1>
					<div className="datatable-responsive-demoPermissoes">
						<DataTable
							className="p-datatable-responsive-demoPermissoes"
							ref={dadosTabela}
							globalFilter={globalFilter}
							value={parametros}
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
								field="empresa"
								header="Empresa"
								bodyStyle={{ color: "red" }}
								//className="table-column-nome"
							/>
							<Column
								field="filial"
								header="Filial"
								bodyStyle={{ color: "red" }}
								//className="table-column-nome"
							/>
							<Column
								field="cod_filial"
								header="Cod. Filial"
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
								body={usuarioBodyTemplate}
								field="cod_usu_update"
								header="Atualizado por:"
								className="table-column-email"
							/>
							<Column
								body={termoBodyTemplate}
								field="pdf_data"
								header="Termo"
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

export default Grupos;
