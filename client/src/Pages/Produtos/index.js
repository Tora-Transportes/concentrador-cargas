import React, { useEffect, useState, useRef } from "react";
import "./produtos.css";
import { Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
//import NavbarNavigator from "../Components/NavbarNavigator";
import ServiceProdutos from "../../services/ServiceProdutos";
import swal from "sweetalert";
import { getClaims } from "../../MicrosoftAuthentication";
import useLoadingScreen from "../Components/LoadingScreen";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
	nameBodyTemplate,
	opcoesTemplate,
	situacaoBodyTemplate,
	usuarioBodyTemplate,
	renderHeader,
} from "./templateDataTable";
import Menusuperior from "../Components/MenuSuperior/menusuperior";

function Produtos() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [produtos, setProdutos] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();

	const dadosTabela = useRef(null);

	const formik = useFormik({
		initialValues: {
			nome: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const produto = (await ServiceProdutos.create(values)).data.data;
				const username = getClaims().name;
				const atualizacao = [
					...produtos,
					{ ...produto, usuario: username, ativo: 1 },
				].sort((a, b) => (a.nome < b.nome ? -1 : 1));
				setProdutos(atualizacao);
				swal("Sucesso!", "O tipo de material foi cadastrado", "success");
				formik.resetForm();
			} catch (error) {
				console.log(error);
			}

			setLoading(false);
		},
	});

	// swal({
	// 	width: 490,
	// });

	async function handleDelete(nome, id) {
		const observacao = await swal(
			"Ops!",
			`Tem certeza que deseja DESATIVAR o produto	${nome}?
			 Preencha a observação abaixo:`,
			"warning",
			{
				content: "input",
				buttons: ["Não", true],
			}
		);
		if (observacao) {
			try {
				await ServiceProdutos.delete({ id, observacao });
				swal("Sucesso", "Produto desativado!", "success");
				setProdutos((p) =>
					p.map((i) => {
						if (i.id !== id) return i;
						return { ...i, ativo: 0, observacao };
					})
				);
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function handleEnableProduto(id) {
		try {
			await ServiceProdutos.enable({ id });
			swal("Sucesso", "Produto ativado", "success");
			setProdutos((p) =>
				p.map((i) => {
					if (i.id !== id) return i;
					return { ...i, ativo: 1 };
				})
			);
		} catch (error) {
			console.log(error);
		}
	}

	async function handleEditProduto(nome, id) {
		const produto = await swal(`Novo nome para o produto '${nome}'`, {
			content: "input",
			buttons: ["Cancelar", true],
		});
		if (produto === null) {
			return;
		}
		if (!produto) {
			return swal("Nenhum dado foi atualizado");
		}

		try {
			await ServiceProdutos.update({ nome: produto, id });

			swal("Sucesso!", "Produto atualizado", "success");

			setProdutos((p) =>
				p

					.map((i) => {
						if (i.id !== id) return i;

						return { ...i, nome: produto };
					})

					.sort((a, b) => (a.nome > b.nome ? 1 : -1))
			);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		ServiceProdutos.list().then(({ data }) => {
			setProdutos(data.data);
		});
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
		return renderHeader(formik, globalFilter, setGlobalFilter);
	};

	return (
		<div className="class-body-produtos">
			<LoadingScreen />
			{/* <NavbarNavigator /> */}
			<Menusuperior />
			<Container className="pagina-produtos">
				<Row>
					<h1 className="class-title-produto">Produtos</h1>
					<div className="datatable-responsive-demoPermissoes">
						<DataTable
							className="p-datatable-responsive-demoPermissoes"
							ref={dadosTabela}
							globalFilter={globalFilter}
							value={produtos}
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
		</div>
	);
}

export default Produtos;
