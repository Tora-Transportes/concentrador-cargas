import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 650,
	},
	rowHighlighted: {
		backgroundColor: theme.palette.action.hover,
	},
	iconHighlight: {
		color: theme.palette.warning.main,
	},
	tableContainer: {
		maxHeight: 440,
		[theme.breakpoints.down("sm")]: {
			maxHeight: 300,
		},
	},
	tableHead: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
}));

export default function PaginatedTableDocumentsLogs({ logs, loading }) {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const slicedData = logs.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	if (loading) {
		return <div>Carregando...</div>;
	}

	return (
		<Paper>
			<TableContainer className={classes.tableContainer}>
				<Table className={classes.table} stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell className={classes.tableHead}>Evento</TableCell>
							<TableCell className={classes.tableHead}>Nome</TableCell>
							<TableCell className={classes.tableHead}>Extensão</TableCell>
							<TableCell className={classes.tableHead}>Data/Hora</TableCell>
							<TableCell className={classes.tableHead}>Usuário</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{slicedData.map((row) => (
							<TableRow key={row.id}>
								<TableCell>
									<Chip
										label={row.operacao == "INSERT" ? "CRIADO" : "DELETADO"}
										color={row.operacao == "INSERT" ? "primary" : "secondary"}
									></Chip>
								</TableCell>
								<TableCell>{row.nome}</TableCell>
								<TableCell>{row.extensao}</TableCell>
								<TableCell>
									{new Date(row.data_hora).toLocaleString()}
								</TableCell>
								<TableCell>{row.cod_user}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 15]}
				component="div"
				count={logs.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
