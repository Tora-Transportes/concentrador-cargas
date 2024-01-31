import { Form } from "react-bootstrap";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "nome_motorista",
			description: "Motorista",
			selector: (row) => row.nome_motorista,
			showFilter: true,
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
			showFilter: false,
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
		{
			name: "mes_avaliacao",
			description: "Mês",
			selector: (row) => row.mes_avaliacao,
			showFilter: true,
		},
		{
			name: "ano_avaliacao",
			description: "Ano",
			selector: (row) => row.ano_avaliacao,
			showFilter: true,
		},
	];

	return { columnsRelatorio };
};
