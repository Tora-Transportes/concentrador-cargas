import React, { useCallback, useEffect, useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "./style.css";
import ViewHistoricoIntegracao from "../view";
import { getColumns } from "../columns";
import factoryReducerCargas from "../../../../../hooks/storageCargas/factoryReducerCargas";
import ServiceIntegracaoConcentradorApp from "src/services/ServiceIntegracaoConcentradorApp";
import useLoadingScreen from "../../../../Components/LoadingScreen";
import HistoryFreight from "../Graficos/historyFreight";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: "#00652e",
		color: "#ffffff",
		display: "flex",
		flexDirection: "column",
		width: 370,
		borderRadius: "20px",
		justifyContent: "center",
		margin: "0px 10px 0px 10px",
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
			margin: "10px 0px 10px 0px",
		},
	},
	media: {
		height: 10,
	},
	rowCardsSecond: {
		display: "flex",
		flexDirection: "row",
		paddingTop: "0px",
		marginLeft: "50px",
		margin: "0px 50px 50px 0px",
		justifyItems: "center",
		justifyContent: "space-between",
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
			alignItems: "center",
		},
	},

	rowCards: {
		display: "flex",
		flexDirection: "row",
		paddingTop: "50px",
		marginLeft: "50px",
		margin: "0px 50px 50px 0px",
		justifyItems: "center",
		justifyContent: "space-between",
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
			alignItems: "center",
		},
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},

	cardContent: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		justifyItems: "center",
	},
	rowStatus: {
		display: "flex",
		flexDirection: "row",
	},
}));

function PainelComponent() {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const classes = useStyles();
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	const [filtroAtual, setFiltroAtual] = useState(null);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [lastOptions, setLastOptions] = useState({});
	const [filial, setFilial] = useState(null);
	const [filiais, setFiliais] = useState([]);
	const [data, setData] = useState({});

	const fetchData = async () => {
		try {
			const { data } = await ServiceIntegracaoConcentradorApp.info(
				filial ? filial.value : 0
			);
			setData(data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	useEffect(() => {
		async function listFiliais() {
			const retorno = await ServiceIntegracaoConcentradorApp.filiais();
			setFiliais(retorno);
		}
		listFiliais();
		fetchData();
	}, []);

	useEffect(() => {
		fetchData();
	}, [filial]);

	const columnsResult = getColumns();
	const columnsPadrao = columnsResult.columnsRelatorio;

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	const tableFetchData = useCallback(
		async function (options) {
			filtroAtual;
			setLoading(true);
			if (options !== lastOptions) {
				setLastOptions(options);
			}
			const { column, direction } = options.orderBy ?? {};
			const { filters, orderBy, page } = options;
			setFiltroAtual({ filters, orderBy, page });
			const { data } = await ServiceIntegracaoConcentradorApp.relatorio({
				...options.filters,
				page: options.page,
				order_column: column,
				order_direction: direction,
			});
			setLoading(false);
			setTotalRegisters(data.data.total_registers);
			dispatchCargas({
				type: "SET",
				payload: { ...data.data, current_page: data.data.page },
			});
		},
		[setLoading, dispatchCargas]
	);

	return (
		<div>
			<LoadingScreen />
			<div className={classes.rowCards}>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h6" component="h2">
								Total cargas integradas
							</Typography>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<h1>
									<NumberSimulationCard
										initialNumber={0}
										targetNumber={data.info_3 ? data.info_3.total_cargas : 0}
										increment={2}
										intervalTime={1}
									/>
								</h1>
							</div>
						</CardContent>
					</CardActionArea>
				</Card>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h6" component="h2">
								Total Cargas com Match
							</Typography>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingTop: "20px",
								}}
							>
								<h1>
									<NumberSimulationCard
										initialNumber={0}
										targetNumber={
											data.info_1 ? data.info_1.total_cargas_match : 0
										}
										increment={2}
										intervalTime={1}
									/>
								</h1>
							</div>
						</CardContent>
					</CardActionArea>
				</Card>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h6" component="h2">
								Total Cargas sem Match
							</Typography>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingTop: "20px",
								}}
							>
								<h1>
									<NumberSimulationCard
										initialNumber={0}
										targetNumber={
											data.info_2 ? data.info_2.total_cargas_sem_match : 0
										}
										increment={2}
										intervalTime={1}
									/>
								</h1>
							</div>
						</CardContent>
					</CardActionArea>
				</Card>
			</div>
			<div className={classes.rowCardsSecond}>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h6" component="h2">
								Total Cargas Canceladas
							</Typography>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingTop: "20px",
								}}
							>
								<h1>
									<NumberSimulationCard
										initialNumber={0}
										targetNumber={
											data.info_4 ? data.info_4.total_cargas_canceladas : 0
										}
										increment={2}
										intervalTime={1}
									/>
								</h1>
							</div>
						</CardContent>
					</CardActionArea>
				</Card>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h6" component="h2">
								Integrações com Sucesso
							</Typography>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingTop: "20px",
								}}
							>
								<h1>
									<NumberSimulationCard
										initialNumber={0}
										targetNumber={
											data.info_5 ? data.info_5.integracoes_sem_erro : 0
										}
										increment={2}
										intervalTime={1}
									/>
								</h1>
							</div>
						</CardContent>
					</CardActionArea>
				</Card>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h6" component="h2">
								Integrações com Erro
							</Typography>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingTop: "20px",
								}}
							>
								<h1>
									<NumberSimulationCard
										initialNumber={0}
										targetNumber={
											data.info_6 ? data.info_6.integracoes_com_erro : 0
										}
										increment={2}
										intervalTime={1}
									/>
								</h1>
							</div>
						</CardContent>
					</CardActionArea>
				</Card>
			</div>
			<HistoryFreight
				data={data.info_7 ? data.info_7 : []}
				setFilial={setFilial}
				filiais={filiais}
				filial={filial}
			></HistoryFreight>
			<ViewHistoricoIntegracao
				get_data={tableFetchData}
				columns={columnsPadrao}
				data={cargas}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				totalRegisters={totalRegisters}
				resetView={resetView}
			/>
		</div>
	);
}

const NumberSimulationCard = ({
	initialNumber,
	targetNumber,
	increment,
	intervalTime,
}) => {
	const [number, setNumber] = useState(initialNumber);

	useEffect(() => {
		if (number < targetNumber) {
			const intervalId = setInterval(() => {
				setNumber((prevNumber) =>
					Math.min(prevNumber + increment, targetNumber)
				);
			}, intervalTime);

			return () => clearInterval(intervalId);
		}

		return () => {};
	}, [number, targetNumber, increment, intervalTime]);

	return <div>{number}</div>;
};

export default PainelComponent;
