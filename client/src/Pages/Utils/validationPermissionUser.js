import { getClaims } from "src/MicrosoftAuthentication";
import ServiceUsuarios from "src/services/ServiceUsuarios";
import Swal from "sweetalert2";

export const validationPermissionUser = async () => {
	const oid = getClaims().oid;
	let permission = localStorage.getItem("adal.user");
	permission = JSON.parse(permission);
	if (permission == null) {
		permission = (
			await ServiceUsuarios.index({
				oid,
			})
		).data.data;
		localStorage.setItem("adal.user", JSON.stringify(permission));
	}
	return permission;
};

export const permissoesVisualizacaoPPO = async () => {
	let permissions = localStorage.getItem("adal.user");
	permissions = JSON.parse(permissions);
	if (permissions.permissoes_visualizacao) {
		if (permissions.permissoes_visualizacao.length == 0) {
			Swal.fire({
				title: "Sem Permissão?",
				text: "Usuário não possui permissões de visualização cadastradas, peça o seu gestor ou responsável para efetuar o cadastro",
				icon: "question",
				confirmButtonText: "Tela início",
			}).then((result) => {
				if (result.isConfirmed) {
					const url = window.location.href.split("/");
					window.location.href = `${url[0]}//${url[2]}/`;
				}
			});
		}
		return permissions.permissoes_visualizacao;
	} else {
		return [];
	}
};

export const getPermissoesVisualizacaoPPO = async () => {
	let permissions = localStorage.getItem("adal.user");
	permissions = JSON.parse(permissions);
	let permissoes = "";
	permissions.permissoes_visualizacao.forEach((element, index) => {
		if (permissions.permissoes_visualizacao.length - 1 == index) {
			permissoes = permissoes + `'${element.filial}'`;
		} else {
			permissoes = permissoes + `'${element.filial}'` + ",";
		}
	});
	return permissoes;
};

export const possuiPermissaoPPOEventosAprovacao = async (permissao) => {
	let permissions = localStorage.getItem("adal.user");
	permissions = JSON.parse(permissions);
	if (permissions.permissao_aprovacao_ppo_eventos) {
		if (permissions.permissao_aprovacao_ppo_eventos.length == 0) {
			Swal.fire({
				title: "Sem Permissão?",
				text: "Usuário não possui permissões de aprovação cadastradas, peça o responsável para efetuar o cadastro",
				icon: "question",
				confirmButtonText: "Tela início",
			}).then((result) => {
				if (result.isConfirmed) {
					const url = window.location.href.split("/");
					window.location.href = `${url[0]}//${url[2]}/`;
				}
			});
		} else {
			if (
				permissions.permissao_aprovacao_ppo_eventos[0].permissao != permissao
			) {
				Swal.fire({
					title: "Nível de permissão necessário",
					text: "Usuário não possui o nível necessário para acessar esse recurso, peça o responsável para efetuar o cadastro ",
					icon: "question",
					confirmButtonText: "Tela início",
				}).then((result) => {
					if (result.isConfirmed) {
						const url = window.location.href.split("/");
						window.location.href = `${url[0]}//${url[2]}/`;
					}
				});
			} else {
				return permissions.permissao_aprovacao_ppo_eventos;
			}
		}
	} else {
		return [];
	}
};
