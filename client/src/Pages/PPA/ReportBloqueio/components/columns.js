const formatNumber = (value) =>
	Number(value || 0).toLocaleString("pt-BR", {
		maximumFractionDigits: 1,
	});

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "cpf",
			description: "CPF",
			selector: (row) => <span className="ppa-document">{row.cpf}</span>,
			showFilter: true,
			style: { width: "190px", minWidth: "190px", maxWidth: "190px" },
		},
		{
			name: "motorista",
			description: "Motorista",
			selector: (row) => String(row.motorista ?? "").toUpperCase(),
			showFilter: true,
			style: { width: "380px", minWidth: "380px", maxWidth: "380px" },
		},
		{
			name: "total",
			description: "Pontuação total",
			selector: (row) => (
				<span className="ppa-score ppa-score--blocked-report">
					{formatNumber(row.total)}
				</span>
			),
			showFilter: false,
			sortable: "sortable",
			style: { width: "180px", minWidth: "180px", maxWidth: "180px" },
		},
		{
			name: "total_bloqueio",
			description: "Nº de bloqueios",
			selector: (row) => (
				<span className="ppa-block-count">
					{Number(row.total_bloqueio || 0).toLocaleString("pt-BR")}
				</span>
			),
			showFilter: false,
			sortable: "sortable",
			style: { width: "180px", minWidth: "180px", maxWidth: "180px" },
		},
	];

	return { columnsRelatorio };
};
