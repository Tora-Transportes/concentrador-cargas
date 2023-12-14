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
			name: "nome_grupo",
			description: "Grupo",
			selector: (row) => row.nome_grupo,
			showFilter: false,
		},
		{
			name: "empresa",
			description: "Cod. Empresa",
			selector: (row) => row.empresa,
			showFilter: false,
		},
		{
			name: "filial",
			description: "Filial",
			selector: (row) => row.filial,
			showFilter: false,
		},
		{
			name: "parametro",
			description: "Nome Parâmetro",
			selector: (row) => row.parametro,
			showFilter: false,
		},
		{
			name: "referencia",
			description: "Valor Gerado",
			selector: (row) => row.referencia,
			showFilter: false,
		},
		{
			name: "operador_logico_primario",
			description: "Operador Lógico - 1",
			selector: (row) => row.operador_logico_primario,
			showFilter: false,
		},
		{
			name: "valor_primario",
			description: "Valor - 1",
			selector: (row) => row.valor_primario,
			showFilter: false,
		},
		{
			name: "faixa_valores",
			description: "Faixa de Valores",
			selector: (row) => (row.faixa_valores === true ? "Sim" : "Não"),
			showFilter: false,
		},
		{
			name: "referencia_secundaria",
			description: "Valor Gerado",
			selector: (row) => row.referencia_secundaria,
			showFilter: false,
		},
		{
			name: "operador_logico_secundaria",
			description: "Operador Lógico - 2",
			selector: (row) => row.operador_logico_secundaria,
			showFilter: false,
		},
		{
			name: "valor_secundario",
			description: "Valor - 2",
			selector: (row) => row.valor_secundario,
			showFilter: false,
		},
		{
			name: "multiplicar_premio",
			description: "Multiplicar Prêmio",
			selector: (row) => (row.multiplicar_premio === true ? "Sim" : "Não"),
			showFilter: false,
		},
		{
			name: "premio_referencia",
			description: "Valor de Referência Prêmio",
			selector: (row) =>
				row.premio_referencia.toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
			showFilter: false,
		},
		{
			name: "premio",
			description: "Valor Prêmio",
			selector: (row) =>
				parseFloat(row.premio).toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
			showFilter: false,
		},
		{
			name: "apto",
			description: "Apto a Receber",
			selector: (row) => (row.apto === true ? "Sim" : "Não"),
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
			name: "anano_avaliacaoo",
			description: "Ano",
			selector: (row) => row.ano_avaliacao,
			showFilter: true,
		},
	];

	return { columnsRelatorio };
};
