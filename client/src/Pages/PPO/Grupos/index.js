import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import useLoadingScreen from "../../Components/LoadingScreen";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { Container, Row } from "react-bootstrap";
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
import ServicePPOGrupos from "src/services/ServicePPOGrupos";

const Grupos = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [parametros, setParametros] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();
	const dadosTabela = useRef(null);

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
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await ServicePPOGrupos.create(values);
				await loadParametros();
				swal("Sucesso!", "O grupo foi cadastrado", "success");
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

	async function handleEditProduto(nome, id) {
		const parametro = await swal(`Novo nome para o grupo '${nome}'`, {
			content: "input",
			buttons: ["Cancelar", true],
		});
		if (parametro === null) {
			return;
		}
		if (!parametro) {
			return swal("Nenhum dado foi atualizado");
		}

		try {
			await ServicePPOGrupos.update({ nome: parametro, id });
			swal("Sucesso!", "Grupo atualizado", "success");
			await loadParametros();
		} catch (error) {
			console.log(error);
		}
	}

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(rowData, swal, handleEditProduto, handleDelete);
	};

	const getRenderHeader = () => {
		return renderHeader(formik, globalFilter, setGlobalFilter);
	};

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
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

export default Grupos;
