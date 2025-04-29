import { useContext } from "react";
import { Form } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { Button } from "reactstrap";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import ServicePPO from "src/services/PPO/ServicePPO";
import Swal from "sweetalert2";

export const getColumns = (grupos, load) => {
	const { isPermissionUser } = useContext(ContextUseDefault);
	const columnsRelatorio = [
		{
			name: "mes_avaliacao",
			description: "Mês",
			selector: (row) => row.mes_avaliacao,
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="01"> Janeiro </option>
					<option value="02"> Fevereiro </option>
					<option value="03"> Março </option>
					<option value="04"> Abril </option>
					<option value="05"> Maio </option>
					<option value="06"> Junho </option>
					<option value="07"> Julho </option>
					<option value="08"> Agosto </option>
					<option value="09"> Setembro </option>
					<option value="10"> Outubro </option>
					<option value="11"> Novembro </option>
					<option value="12"> Dezembro </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "ano_avaliacao",
			description: "Ano",
			selector: (row) => row.ano_avaliacao,
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="2024"> 2024 </option>
					<option value="2025"> 2025 </option>
					<option value="2026"> 2026 </option>
					<option value="2027"> 2027 </option>
					<option value="2028"> 2028 </option>
					<option value="2029"> 2029 </option>
					<option value="2030"> 2030 </option>
					<option value="2031"> 2031 </option>
					<option value="2032"> 2032 </option>
					<option value="2033"> 2033 </option>
					<option value="2034"> 2034 </option>
					<option value="2035"> 2035 </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "nome_motorista",
			description: "Motorista",
			selector: (row) => row.nome_motorista,
			showFilter: true,
		},
		{
			name: "tipo",
			description: "Tipo",
			selector: (row) => (row.tipo === 1 ? "Automático" : "Manual"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="1"> Automático </option>
					<option value="2"> Manual </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "ativo",
			description: "Ativo",
			selector: (row) => (row.ativo === true ? "Sim" : "Não"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="1"> Sim </option>
					<option value="0"> Não </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "excluir",
			description: "Excluir",
			static_column: true,
			selector: (row) => (
				<Button
					color={row.ativo === false ? undefined : "danger"}
					size="sm"
					disabled={row.ativo === false}
					className={`btn-icon btn-2 ${
						row.ativo === 0 ? "bg-gray-400 text-white cursor-not-allowed" : ""
					}`}
					onClick={() => {
						if (!isPermissionUser?.includes("PPO_PERMISSAO_EXCLUSAO")) {
							Swal.fire(
								"Ops!",
								"Sem permissão para executar essa ação",
								"warning"
							);
							return;
						}

						Swal.fire({
							title: "Confirmar remoção?",
							html: `
				<strong>Nome:</strong> ${row.nome_motorista} <br/>
				<strong>CPF:</strong> ${row.cpf} <br/>
				<strong>Mês:</strong> ${row.mes_avaliacao} <br/>
				<strong>Ano:</strong> ${row.ano_avaliacao}
			`,
							input: "textarea",
							inputLabel: "Observação",
							inputPlaceholder: "Digite a justificativa para remoção",
							inputAttributes: {
								"aria-label": "Digite a justificativa para remoção",
							},
							inputValidator: (value) => {
								if (!value) {
									return "A observação é obrigatória!";
								}
							},
							icon: "warning",
							showCancelButton: true,
							confirmButtonColor: "#d33",
							cancelButtonColor: "#3085d6",
							confirmButtonText: "Sim, remover!",
							cancelButtonText: "Cancelar",
							preConfirm: (observacao) => {
								return observacao;
							},
						}).then(async (result) => {
							if (result.isConfirmed && result.value) {
								await ServicePPO.removerPpo({
									cpf: row.cpf,
									mes: row.mes_avaliacao,
									ano: row.ano_avaliacao,
									observacao: result.value,
								});
								await load();
							}
						});
					}}
				>
					<MdDeleteForever />
				</Button>
			),
		},
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "matricula",
			description: "Matrícula",
			selector: (row) => row.matricula,
			showFilter: true,
		},
		{
			name: "grupo",
			description: "Grupo",
			selector: (row) => row.grupo,
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					{grupos.map((data, index) => (
						<option key={index} value={data.nome}>
							{data.nome}
						</option>
					))}
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "empresa",
			description: "Empresa",
			selector: (row) => row.empresa,
			showFilter: false,
		},
		{
			name: "QtdeEventosInterjornada",
			description: "Qtde Eventos Interjornada",
			selector: (row) => row.QtdeEventosInterjornada,
			showFilter: false,
		},
		{
			name: "QtdeEventosVelocidade",
			description: "Qtde Eventos Velocidade",
			selector: (row) => row.QtdeEventosVelocidade,
			showFilter: false,
		},
		{
			name: "NotaAvaliacaoMotorista",
			description: "Nota Avaliação Motorista",
			selector: (row) => row.NotaAvaliacaoMotorista,
			showFilter: false,
		},
		{
			name: "KmRodado",
			description: "KM Rodado",
			selector: (row) => row.KmRodado,
			showFilter: false,
		},
		{
			name: "ValorInterjornada",
			description: "Valor Interjornada",
			selector: (row) =>
				row.ValorInterjornada.toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
			showFilter: false,
		},
		{
			name: "ValorVelocidade",
			description: "Valor Velocidade",
			selector: (row) =>
				row.ValorVelocidade.toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
			showFilter: false,
		},
		{
			name: "ValorAvaliacao",
			description: "Valor Avaliação",
			selector: (row) =>
				row.ValorAvaliacao.toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
			showFilter: false,
		},
		{
			name: "ValorKMRodado",
			description: "Valor KM Rodado",
			selector: (row) =>
				row.ValorKMRodado.toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
			showFilter: false,
		},
		{
			name: "Total",
			description: "Total",
			selector: (row) =>
				row.Total.toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
			showFilter: false,
		},
		{
			name: "ppo_cancelado",
			description: "PPO Cancelado",
			selector: (row) => (row.ppo_cancelado === true ? "Sim" : "Não"),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="1"> Sim </option>
					<option value="0"> Não </option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "observacao",
			description: "Observação",
			selector: (row) => row.observacao,
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
