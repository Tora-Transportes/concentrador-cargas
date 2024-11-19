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
	IconButton,
	Tooltip,
} from "@material-ui/core";
import { FaStar } from "react-icons/fa";
import { MdModeOfTravel } from "react-icons/md";
import { FaTruckArrowRight } from "react-icons/fa6";
import { IoIosHelpCircle } from "react-icons/io";
import { BsAppIndicator } from "react-icons/bs";
import swal from "sweetalert";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 650,
	},
	rowHighlighted: {
		backgroundColor: theme.palette.action.hover,
	},
	infrator: {
		backgroundColor: "#6ef5a4",
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

export default function PaginatedTableInfratores({
	data,
	notificacao,
	indicarCondutor,
}) {
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

	async function indicaInfrator(infrator) {
		await indicarCondutor({ infrator: infrator, notificacao: notificacao });
	}

	const slicedData = data.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<Paper>
			<TableContainer className={classes.tableContainer}>
				<Table className={classes.table} stickyHeader>
					<TableHead>
						<TableRow>
							{!notificacao.existeInfrator ? (
								<TableCell className={classes.tableHead}>Indicar</TableCell>
							) : (
								<></>
							)}
							<TableCell className={classes.tableHead}>Viagem</TableCell>
							<TableCell className={classes.tableHead}>Veículo</TableCell>
							<TableCell className={classes.tableHead}>Nome</TableCell>
							<TableCell className={classes.tableHead}>Categoria</TableCell>
							<TableCell className={classes.tableHead}>Data Infração</TableCell>
							<TableCell className={classes.tableHead}>Data Emissao</TableCell>
							<TableCell className={classes.tableHead}>Data Previsão</TableCell>
							<TableCell className={classes.tableHead}>
								Sugestão Infrator
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{slicedData.map((row) => (
							<TableRow
								key={row.id}
								className={
									row.infrator == 1
										? classes.infrator
										: row.possivel_sugestao_infrator
										? classes.rowHighlighted
										: ""
								}
							>
								{!notificacao.existeInfrator ? (
									<TableCell>
										<Button
											variant="text"
											onClick={async (e) => {
												e.preventDefault();
												const resultOk = await swal(
													`Certeza que deseja indicar o infrator ${row.nome}?`,
													{
														dangerMode: true,
														buttons: ["Cancelar", true],
														icon: "warning",
													}
												);
												if (resultOk) {
													indicaInfrator(row);
												}
											}}
											style={{
												color: "black",
												border: "none",
												padding: 0,
												backgroundColor: "transparent",
												boxShadow: "none",
											}}
										>
											<BsAppIndicator size={25} className="icon-info" />
										</Button>
									</TableCell>
								) : (
									<></>
								)}

								<TableCell>
									{" "}
									<Button
										variant="outline-primary"
										onClick={(e) => {
											e.preventDefault();
											swal(
												`${row.tipo_documento} : ${row.documento_id} \n CATEGORIA : ${row.categoria_motorista}`
											);
										}}
									>
										<MdModeOfTravel className="icon-info" />
										Info
									</Button>
								</TableCell>
								<TableCell>
									{" "}
									<Button
										variant="outline-primary"
										onClick={(e) => {
											e.preventDefault();
											swal(
												`CAVALO : ${row.cavalo} \n CARRETA : ${
													row.carreta ? row.carreta : "N/A"
												} \n BITREM : ${row.bitrem ? row.bitrem : "N/A"}`
											);
										}}
									>
										<FaTruckArrowRight className="icon-info" />
									</Button>
								</TableCell>
								<TableCell>
									{row.nome}{" "}
									<Button
										variant="text"
										onClick={(e) => {
											e.preventDefault();
											swal(`CPF : ${row.cpf} `);
										}}
										style={{
											color: "black",
											border: "none",
											padding: 0,
											backgroundColor: "transparent",
											boxShadow: "none",
										}}
									>
										<IoIosHelpCircle size={25} className="icon-info" />
									</Button>
								</TableCell>
								<TableCell>{row.categoria_motorista}</TableCell>
								<TableCell>
									{new Date(row.data_infracao).toLocaleDateString()}
								</TableCell>
								<TableCell>
									{new Date(row.emissao).toLocaleDateString()}
								</TableCell>
								<TableCell>
									{row.previsao
										? new Date(row.previsao).toLocaleDateString()
										: "N/A"}
								</TableCell>
								<TableCell>
									{row.possivel_sugestao_infrator ? (
										<Tooltip title="Possível infrator">
											<IconButton className={classes.iconHighlight}>
												<FaStar />
											</IconButton>
										</Tooltip>
									) : (
										"N/A"
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 15]}
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
