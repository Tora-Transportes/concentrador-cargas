import React, { useState, useRef } from "react";
import "./index.css";
import { Container, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
//import NavbarNavigator from "../../Components/NavbarNavigator";
import ServiceUsuarios from "../../../services/ServiceUsuarios";
import useDebouncedFunction from "../../Components/useDebounceFunction";
import swal from "sweetalert";
import { MultiSelect } from "primereact/multiselect";
import { MdDeleteForever } from "react-icons/md";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { allTipoPermissoes } from "../../Utils/permissionUser";
import {
	renderHeader,
	actionBodyTemplate,
	emailBodyTemplate,
	nameBodyTemplate,
	permissBodyTemplate,
} from "./templateDataTable";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";

function Permissoes() {
	const [users, setUsers] = useState([]);
	const [permissSelecionado, setPermissSeleciondo] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();

	const dadosTabela = useRef(null);

	const limparPermissoes = () => {
		setPermissSeleciondo([]);
	};

	const formik = useFormik({
		initialValues: {
			query: "",
		},
	});

	useDebouncedFunction(
		function () {
			ServiceUsuarios.search({ q: formik.values.query }).then((response) => {
				setUsers(response.data.data.results);
			});
		},
		formik.values.query,
		500
	);

	async function handleSavePermissions(rowData, apagar) {
		const { oid, permissoes } = await rowData;

		if (!permissSelecionado.length && !apagar) {
			await swal("👀", "Nenhuma alteração aplicada", "warning");
		} else {
			permissSelecionado.map((item) => {
				if (!permissoes.includes(item.name)) {
					permissoes.push(item.name);
				}
			});
			const message = apagar
				? "Certeza que deseja deletar permissão do usuário ?"
				: "Certeza que deseja aplicar essas permissões para o usuário?";

			if (
				await swal("👀", message, "warning", {
					buttons: ["Não", true],
				})
			) {
				await ServiceUsuarios.changePermissions({ oid, permissoes });
				setUsers((old) =>
					old.map((i) => {
						if (i.oid === oid) {
							return { ...i, permissoes: permissoes };
						}
						return i;
					})
				);
				swal("Sucesso", "Permissões alteradas", "success");
				limparPermissoes();
			}
		}
	}

	const deletePermission = (permissCancelada, oid) => {
		users.map((item) => {
			if (item.oid === oid) {
				item.permissoes.splice(item.permissoes.indexOf(permissCancelada), 1);
				handleSavePermissions(item, true);
			}
		});
	};

	const getActionBodyTemplate = (rowData) => {
		return actionBodyTemplate(rowData, handleSavePermissions);
	};

	const getPermissBodyTemplate = (rowData) => {
		return permissBodyTemplate(rowData, deletePermission);
	};

	const getRenderHeader = () => {
		return renderHeader(globalFilter, setGlobalFilter);
	};

	return (
		<div className="class-body-permissoes">
			{/* <NavbarNavigator /> */}
			<Menusuperior />
			<Container className="text-center mb-4 mt-4">
				<Row>
					<Col>
						<h1 className="class-title-Permissao">Permissões dos usuários</h1>
					</Col>
				</Row>
				<Row>
					<div className="page-add-permissin-user">
						<div className="form-multSelect">
							<MultiSelect
								display="chip"
								value={permissSelecionado}
								options={allTipoPermissoes}
								onChange={(e) => setPermissSeleciondo(e.value)}
								optionLabel="name"
								placeholder="Selecionar permissões"
								filter={true}
								filterPlaceholder="Procurar"
							/>

							<button
								onClick={limparPermissoes}
								disabled={permissSelecionado.length === 0}
								className="form-multSelect-button"
							>
								<MdDeleteForever size={20} color="white" />
								<span>Limpar buscas</span>
							</button>
						</div>

						<div className="table-add-permission">
							<div className="datatable-responsive-demo">
								<DataTable
									className="p-datatable-responsive-demo"
									ref={dadosTabela}
									value={users}
									globalFilter={globalFilter}
									header={getRenderHeader()}
									paginator
									rows={10}
									emptyMessage="Não foram encontrado nenhum resultado nesta busca"
									paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
									rowsPerPageOptions={[15, 20, 25]}
								>
									<Column
										body={nameBodyTemplate}
										field="nome"
										header="Nome"
										className="table-column-nome"
									/>
									<Column
										body={emailBodyTemplate}
										field="email"
										header="Email"
										className="table-column-email"
									/>
									<Column
										key="permissoes"
										columnKey="permissoesColumn"
										body={getPermissBodyTemplate}
										field="permissoes"
										className="table-column-permissoes"
										header="Permissão"
									/>
									<Column
										body={getActionBodyTemplate}
										className="table-column-button"
										headerStyle={{ width: "9em", textAlign: "center" }}
									/>
								</DataTable>
							</div>
						</div>
					</div>
				</Row>
			</Container>
		</div>
	);
}

export default Permissoes;
