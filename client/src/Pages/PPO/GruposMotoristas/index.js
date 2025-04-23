import React, { useContext, useEffect, useRef, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import { useParams } from "react-router-dom";
import "./styles.css";
import { Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import ServicePPOGruposMotoristas from "src/services/PPO/ServicePPOGruposMotoristas";
import swal from "sweetalert";
//import { getClaims } from "../../MicrosoftAuthentication";
import useLoadingScreen from "../../Components/LoadingScreen";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
	opcoesTemplate,
	criadoBodyTemplate,
	atualizadoBodyTemplate,
	renderHeader,
} from "./components/templateDataTable";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";

const GruposMotoristas = () => {
	const { id } = useParams();
	const { isPermissionUser } = useContext(ContextUseDefault);
	const searchParams = new URLSearchParams(document.location.search);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [gruposParametros, setGruposParametros] = useState([]);
	const [motoristasAtivosSelect, setMotoristasAtivosSelect] = useState([]);
	const [motoristasAtivos, setMotoristasAtivos] = useState([]);
	const [globalFilter, setGlobalFilter] = useState();
	const [openCreate, setOpenCreate] = useState(false);
	const [forceLoad, setForceLoad] = useState(false);

	async function forceLoading() {
		setForceLoad(!forceLoad);
	}

	function handleOpenCreate() {
		setOpenCreate(!openCreate);
	}

	const dadosTabela = useRef(null);

	const MotoristaSchema = Yup.object().shape({
		item: Yup.object()
			.shape({
				value: Yup.string().required("Motorista é um campo obrigatório"),
				label: Yup.string().required("Motorista é um campo obrigatório"),
			})
			.required("Motorista é campo obrigatórios"),
	});

	const formik = useFormik({
		initialValues: {
			grupo_id: id,
		},
		validationSchema: MotoristaSchema,
		/* 		onChange: async (values) => {
			console.log(values);
		}, */

		onSubmit: async (values) => {
			setLoading(true);
			try {
				if (!isPermissionUser?.includes("PPO_ADD_MOTORISTA_GRUPO")) {
					swal("Ops!", "Sem permissão para executar essa ação", "warning");
					setLoading(false);
					return;
				}
				const motoristaFiltrado = motoristasAtivos.filter(
					(motorista) => motorista.cpf === values.item.value
				);
				if (motoristaFiltrado.length === 0) {
					swal("Ops!", "Motorista não encontrado!", "error");
					return;
				} else {
					if (motoristaFiltrado[0].status != "FUNCIONARIO EM SITUACAO NORMAL") {
						swal(
							"Ops!",
							`Motorista não está em situação normal! SITUAÇÃO : ${motoristaFiltrado[0].status}`,
							"error"
						);
						return;
					}
				}

				//Todo: Verificar se o motorista já está no grupo
				const motoristaJaCadastrado = (
					await ServicePPOGruposMotoristas.driverIsLiked(values.item.value)
				).data;

				if (motoristaJaCadastrado.data.length > 0) {
					if (motoristaJaCadastrado.data[0].grupo_id == id) {
						swal("Ops!", "Motorista já está no grupo!", "error");
						setLoading(false);
						return;
					}
					setLoading(false);
					const observacao = await Swal.fire({
						title: "Ops!",
						html: `O motorista de nome: <strong>${
							motoristaJaCadastrado.data[0].nome
						}</strong> |
							  <strong>${
									motoristaJaCadastrado.data[0].cpf
								}</strong> já está atrelado ao grupo 
							  <strong>${motoristaJaCadastrado.data[0].nome_grupo}</strong>.<br><br> 
							  Deseja adicionar ele no grupo <strong>${searchParams.get(
									"nome_grupo"
								)}</strong>?<br><br>
							  <strong>Observação:</strong> Ele será removido do outro grupo.`,
						icon: "warning",
						showCancelButton: true,
						confirmButtonText: "Sim",
						cancelButtonText: "Não",
					});
					if (observacao.isConfirmed) {
						setLoading(true);
						const body = {
							grupo_id: values.grupo_id,
							nome: motoristaFiltrado[0].nome,
							cpf: motoristaFiltrado[0].cpf,
							codigo_motorista: "",
							filial: motoristaFiltrado[0].filial,
							empresa: motoristaFiltrado[0].empresa,
							codigo_empresa: motoristaFiltrado[0].cod_empresa,
							status: motoristaFiltrado[0].status,
						};
						await ServicePPOGruposMotoristas.create(body);
						await forceLoading();
						formik.resetForm();
						handleOpenCreate();
					}
				} else {
					const body = {
						grupo_id: values.grupo_id,
						nome: motoristaFiltrado[0].nome,
						cpf: motoristaFiltrado[0].cpf,
						codigo_motorista: "",
						filial: motoristaFiltrado[0].filial,
						empresa: motoristaFiltrado[0].empresa,
						codigo_empresa: motoristaFiltrado[0].cod_empresa,
						status: motoristaFiltrado[0].status,
					};
					await ServicePPOGruposMotoristas.create(body);
					await forceLoading();
					formik.resetForm();
					handleOpenCreate();
				}
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	async function handleDelete(nome, id) {
		if (!isPermissionUser?.includes("PPO_ADD_MOTORISTA_GRUPO")) {
			swal("Ops!", "Sem permissão para executar essa ação", "warning");
			setLoading(false);
			return;
		}
		const observacao = await swal(
			"Ops!",
			`Tem certeza que deseja remover o motorista ${nome} do grupo?`,
			"warning",
			{
				buttons: ["Não", true],
			}
		);
		if (observacao) {
			try {
				await ServicePPOGruposMotoristas.delete(id);
				await forceLoading();
				swal("Sucesso", "Motorista removido com sucesso!", "success");
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function listagem() {
		return ServicePPOGruposMotoristas.list(id);
	}

	async function listaMotoristasAtivos() {
		return ServicePPOGruposMotoristas.motoristasAtivos();
	}

	useEffect(() => {
		Promise.all([listagem(), listaMotoristasAtivos()]).then(function (values) {
			setGruposParametros(values[0].data.data);
			const motoristasAtivos = [];
			values[1].data.data.map((mot) => {
				motoristasAtivos.push({
					value: mot.cpf,
					label: `${mot.nome} - ${mot.matricula} - ${mot.cpf}`,
				});
			});
			setMotoristasAtivosSelect(motoristasAtivos);
			setMotoristasAtivos(values[1].data.data);
		});
	}, [forceLoad]);

	const getOpcoesTemplate = (rowData) => {
		return opcoesTemplate(rowData, handleDelete);
	};

	const getRenderHeader = () => {
		return renderHeader(
			formik,
			openCreate,
			handleOpenCreate,
			globalFilter,
			setGlobalFilter,
			motoristasAtivosSelect
		);
	};

	return (
		<div className="class-body-produtos">
			<LoadingScreen />
			<Menusuperior />
			<Container className="pagina-produtos">
				<Row>
					<h1 className="class-title-produto">
						Motoristas do Grupo : {searchParams.get("nome_grupo")}{" "}
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
								field="nome"
								header="Nome"
								style={{ textAlign: "center" }}
							/>
							<Column field="cpf" header="CPF" />
							<Column
								field="empresa"
								header="Empresa"
								style={{ textAlign: "center" }}
							/>
							<Column field="filial" header="Filial" />
							<Column field="status" header="Status" />
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

export default GruposMotoristas;
