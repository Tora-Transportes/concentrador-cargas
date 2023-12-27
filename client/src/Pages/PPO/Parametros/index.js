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
} from "./components/templateDataTable";
import swal from "sweetalert";
import * as Yup from "yup";
import ServicePPOParametros from "src/services/ServicePPOParametros";

const ParametroSchema = Yup.object().shape({
	nome: Yup.string()
		.min(2, "Muito Pequeno!")
		.max(100, "Muito Longo!")
		.required("Requerido"),
	cod_verba: Yup.string().required("cod verba é um campo obrigatório"),
});

const Parametros = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [parametros, setParametros] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();
	const dadosTabela = useRef(null);
	const [open, setOpen] = useState(false);
	const [openCreate, setOpenCreate] = useState(false);
	const [idEdit, setIdEdit] = useState(null);

	async function loadParametros() {
		setLoading(true);
		ServicePPOParametros.list().then(({ data }) => {
			setParametros(data.data);
		});
		setLoading(false);
	}

	const formik = useFormik({
		initialValues: {
			nome: "",
			cod_verba: "",
		},
		validationSchema: ParametroSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await ServicePPOParametros.create(values);
				await loadParametros();
				swal("Sucesso!", "O parâmetro foi cadastrado", "success");
				formik.resetForm();
				handleOpenCreate();
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	function handleOpen() {
		setOpen(!open);
	}
	function handleOpenCreate() {
		setOpenCreate(!openCreate);
	}

	useEffect(() => {
		loadParametros();
		setGlobalFilter("");
	}, []);

	async function handleDelete(nome, id) {
		const observacao = await swal(
			"Ops!",
			`Tem certeza que deseja DELETAR o parâmetro ${nome}?`,
			"warning",
			{
				buttons: ["Não", true],
			}
		);
		if (observacao) {
			try {
				await ServicePPOParametros.delete({ id });
				swal("Sucesso", "Parâmetro desativado!", "success");
				await loadParametros();
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function handleEditParametro(objeto, id) {
		setIdEdit(id);
		formik.values.nome = objeto.nome;
		formik.values.cod_verba = objeto.cod_verba;
		handleOpen();
	}

	async function submitEdit() {
		try {
			await ServicePPOParametros.update(idEdit, formik.values);
			swal("Sucesso", "Parâmetro atualizado!", "success");
			handleOpen();
			await loadParametros();
		} catch (error) {
			console.log(error);
		}
	}

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(rowData, handleEditParametro, handleDelete);
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
							controlId="validationFormikCodVerbaEdit"
						>
							<Form.Label>Cod. Verba</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Cod. Verba"
									aria-describedby="inputGroupPrepend"
									name="cod_verba"
									value={formik.values.cod_verba}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.cod_verba}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.cod_verba}
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
					<h1 className="class-title-produto">Parâmetros</h1>
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
								field="cod_verba"
								header="Cod. Verba"
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

export default Parametros;
