import { FaExchangeAlt, FaPlus, FaTrash } from "react-icons/fa";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => row.cpf,
			showFilter: true,
		},
		{
			name: "nome",
			description: "Nome",
			selector: (row) => row.nome,
			showFilter: true,
		},
		{
			name: "filial",
			description: "Filial",
			selector: (row) => row.filial,
			showFilter: false,
		},
		{
			name: "empresa",
			description: "Empresa",
			selector: (row) => row.empresa,
			showFilter: false,
		},
		{
			name: "codigo_empresa",
			description: "Código da Empresa",
			selector: (row) => row.codigo_empresa,
			showFilter: false,
		},
		{
			name: "status_mot",
			description: "Status",
			selector: (row) => row.status_mot,
			showFilter: false,
		},
		{
			name: "tipo_movimentacao",
			description: "Tipo de Movimentação",
			selector: (row) => {
				const map = {
					create: "Criação",
					delete: "Exclusão",
					moved: "Trocou de Grupo",
				};
				return map[row.tipo_movimentacao] || row.tipo_movimentacao;
			},
			showFilter: false,
		},
		{
			name: "show_movimentacao",
			description: "Movimentação",
			selector: (row) => {
				const map = {
					create: {
						label: "Entrou em",
						icon: <FaPlus className="text-green-500 mr-2" />,
					},
					delete: {
						label: "Removido de ",
						icon: <FaTrash className="text-red-500 mr-2" />,
					},
					moved: {
						label: "Saiu de ",
						icon: <FaExchangeAlt className="text-blue-500 mr-2" />,
					},
				};

				const item = map[row.tipo_movimentacao];

				return item ? (
					<div className="flex items-center">
						<span className="mr-5">
							{item.icon} {"  "}
						</span>
						<span>{item.label}</span>
					</div>
				) : (
					row.tipo_movimentacao
				);
			},
			showFilter: false,
		},
		{
			name: "nome_grupo",
			description: "Grupo",
			selector: (row) => row.nome_grupo,
			showFilter: false,
		},
		{
			name: "pgm_cod_usu",
			description: "Usuário Criação PGM",
			selector: (row) => row.pgm_cod_usu,
			showFilter: false,
		},
		{
			name: "pgm_created_at",
			description: "Data Criação PGM",
			selector: (row) => new Date(row.pgm_created_at).toLocaleString("pt-BR"),
			showFilter: false,
		},
		{
			name: "pgmh_id",
			description: "ID Movimentação",
			selector: (row) => row.pgmh_id,
			showFilter: false,
		},
		{
			name: "ultima_movimentacao_id",
			description: "ID Movimentação Anterior",
			selector: (row) => row.ultima_movimentacao_id ?? "-",
			showFilter: false,
		},
		{
			name: "pgmh_cod_usu",
			description: "Usuário Movimentação",
			selector: (row) => row.pgmh_cod_usu,
			showFilter: false,
		},
		{
			name: "pgmh_created_at",
			description: "Data Movimentação",
			selector: (row) => new Date(row.pgmh_created_at).toLocaleString("pt-BR"),
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
