import React, { useCallback, useEffect, useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import { MdRefresh } from "react-icons/md";
import "./style.css";
import ViewPPOCalculador from "../view";
import { getColumns } from "../columns";
import factoryReducerCargas from "../../../../../hooks/storageCargas/factoryReducerCargas";
import ServicePPOCalculador from "src/services/ServicePPOCalculador";
import useLoadingScreen from "../../../../Components/LoadingScreen";
import { formatDateTimeZone } from "../../../../Utils/formatDate";

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

function PainelComponent({ data, handleReprocessar }) {
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
			const { data } = await ServicePPOCalculador.relatorio({
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
								Quantidade de PPO Calculados
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
										targetNumber={data.qtd_ppo_calculados}
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
								Data último processamento
							</Typography>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									paddingTop: "20px",
								}}
							>
								<h4>{formatDateTimeZone(data.data_ult_processamento)}</h4>
							</div>
						</CardContent>
					</CardActionArea>
					<CardActions>
						{data.processando == false ? (
							<Fab variant="extended" onClick={handleReprocessar}>
								<MdRefresh size={26} className={classes.extendedIcon} />
								Reprocessar
							</Fab>
						) : (
							<></>
						)}
					</CardActions>
				</Card>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h6" component="h2">
								Status do serviço
							</Typography>
							<div className={classes.rowStatus}>
								{data.processando == false ? (
									<div className="pulsating-ball-stady"></div>
								) : (
									<div className="pulsating-ball-green"></div>
								)}
								<div style={{ paddingLeft: "10px" }}>
									{data.processando == false ? "Standy By" : "Em Execução"}
								</div>
							</div>
							{data.processando == false ? (
								<></>
							) : (
								<div style={{ marginTop: "15px" }}>
									{data?.data_processando
										? data.data_processando.qtd_processada
										: 0}{" "}
									de{" "}
									{data?.data_processando ? data.data_processando.qtd_final : 0}{" "}
									motoristas processados
								</div>
							)}
						</CardContent>
					</CardActionArea>
				</Card>
			</div>
			<ViewPPOCalculador
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
