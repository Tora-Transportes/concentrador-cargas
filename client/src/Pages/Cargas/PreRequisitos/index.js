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
	yesOrNoBodyTemplateAT,
	yesOrNoBodyTemplateQT,
} from "./components/templateDataTable";
import swal from "sweetalert";
import ServicePreRequisitos from "src/services/ServicePreRequisitos";
import * as Yup from "yup";

const GrupoSchema = Yup.object().shape({
	nome: Yup.string().required("nome é um campo obrigatório"),
	exige_quantidade: Yup.number()
		.oneOf([1, 0], "Opção inválida")
		.required("Campo obrigatório"),
});

const PreRequisitos = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [parametros, setParametros] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();
	const dadosTabela = useRef(null);
	const [open, setOpen] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);
	const [idEdit, setIdEdit] = useState(null);

	function handleOpen() {
		setOpen(!open);
	}
	function handleOpenCreate() {
		setOpenCreate(!openCreate);
	}

	async function loadParametros() {
		setLoading(true);
		ServicePreRequisitos.list().then(({ data }) => {
			setParametros(data.data);
		});
		setLoading(false);
	}

	const formik = useFormik({
		initialValues: {
			nome: "",
			exige_quantidade: "",
		},
		validationSchema: GrupoSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await ServicePreRequisitos.create(values);
				await loadParametros();
				handleOpenCreate();
				swal("Sucesso!", "O requisito foi cadastrado", "success");
				formik.resetForm();
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

	async function handleDelete(nome, id) {
		const observacao = await swal(
			"Ops!",
			`Tem certeza que deseja DESATIVAR o requisito ${nome}?`,
			"warning",
			{
				buttons: ["Não", true],
			}
		);
		if (observacao) {
			try {
				setLoading(true);
				await ServicePreRequisitos.delete(id);
				await loadParametros();
				setLoading(false);
				swal("Sucesso", "Requisito desativado!", "success");
			} catch (error) {
				setLoading(false);
				console.log(error);
			}
		}
	}

	async function submitEdit() {
		try {
			setLoading(true);
			await ServicePreRequisitos.update(idEdit, formik.values);
			await loadParametros();
			formik.resetForm();
			handleOpen();
			setLoading(false);
			swal("Sucesso", "O requisito foi atualizado!", "success");
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}

	async function handleEditProduto(objeto, id) {
		setIdEdit(id);
		formik.values.nome = objeto.nome;
		formik.values.exige_quantidade = objeto.exige_quantidade;
		handleOpen();
	}

	async function handleEnable(id) {
		try {
			setLoading(true);
			await ServicePreRequisitos.enable(id);
			await loadParametros();
			setLoading(false);
			swal("Sucesso", "Requisito ativado!", "success");
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(
			rowData,
			handleEditProduto,
			handleDelete,
			handleEnable
		);
	};

	const getRenderHeader = () => {
		return renderHeader(
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
						<Form.Group className="mb-3" controlId="validationFormikNome">
							<Form.Label>Nome</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Nome"
									aria-describedby="inputGroupPrepend"
									name="nome"
									value={formik.values.nome || ""}
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
							controlId="validationFormikExigeQuantidade"
						>
							<Form.Label>Exige Quantidade</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									as="select"
									aria-describedby="inputGroupPrepend"
									name="exige_quantidade"
									value={formik.values.exige_quantidade || ""}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.exige_quantidade}
								>
									<option value="">Escolha uma opção</option>
									<option value={1}>Sim</option>
									<option value={0}>Não</option>
								</Form.Control>
								<Form.Control.Feedback type="invalid">
									{formik.errors.exige_quantidade}
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
					<h1 className="class-title-produto">Pré-requisitos</h1>
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
								//className="table-column-nome"
							/>
							<Column
								body={yesOrNoBodyTemplateQT}
								field="exige_quantidade"
								header="Exige Quantidade"
							/>
							<Column
								body={yesOrNoBodyTemplateAT}
								field="ativo"
								header="Ativo"
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

export default PreRequisitos;
