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
	situacaoBodyTemplate,
	usuarioBodyTemplate,
	renderHeader,
} from "./components/templateDataTable";
import swal from "sweetalert";

const Parametros = () => {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [parametros, setParametros] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();
	const dadosTabela = useRef(null);

	const formik = useFormik({
		initialValues: {
			nome: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			console.log(values);
			setParametros([]);
			setLoading(false);
		},
	});
	useEffect(() => {
		setLoading(true);
		setLoading(false);
		setGlobalFilter("");
	}, []);

	async function handleDelete(nome, id) {
		console.log(nome, id);
	}

	async function handleEnableProduto(id) {
		console.log(id);
	}

	async function handleEditProduto(nome, id) {
		console.log(nome, id);
	}

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
		return renderHeader(formik, globalFilter, setGlobalFilter);
	};

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
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
								body={usuarioBodyTemplate}
								field="usuario"
								header="Atualizado por:"
								className="table-column-email"
							/>
							<Column
								body={situacaoBodyTemplate}
								field="ativo"
								className="table-column-permissoes"
								header="Situação"
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
