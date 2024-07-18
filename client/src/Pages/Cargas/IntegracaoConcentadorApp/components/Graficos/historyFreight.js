import React from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { parseISO, format, addMinutes } from "date-fns";
import "./BarChart.css";
import { Accordion } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

// Registrar os componentes do Chart.js e o plugin de anotação
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, filiais, filial, setFilial }) => {
	const handleSelectClick = (event) => {
		event.stopPropagation();
	};

	if (data.length === 0) {
		<div className="chart-container">
			<Accordion alwaysOpen style={{ marginTop: "20px" }}>
				<Accordion.Item>
					<Accordion.Header>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyItems: "center",
								width: "100%",
							}}
						>
							<b style={{ marginRight: "20px" }}>
								Estatísticas da Integração Concentrador vs App
							</b>
							<div onClick={handleSelectClick}>
								<Select
									className="select-container"
									minMenuHeight={200}
									id="filiais"
									name="filiais"
									isLoading={filiais.length === 0}
									placeholder="Selecionar Grupos"
									options={filiais}
									components={animatedComponents}
									onChange={(option) => setFilial(option)}
									value={filial == null ? filiais[0] : filial}
								/>
							</div>
						</div>
					</Accordion.Header>
					<Accordion.Body>
						<div className="loading">Loading...</div>;
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>;
	}

	// Calcular os totais
	const totalForaApp = data.reduce((acc, curr) => acc + curr.total_fora_app, 0);
	const totalSemMatch = data.reduce(
		(acc, curr) => acc + curr.total_sem_match,
		0
	);
	const totalComMatch = data.reduce(
		(acc, curr) => acc + curr.total_com_match,
		0
	);

	// Preparar os dados para o gráfico
	const chartData = {
		labels: data.map((item) =>
			format(
				addMinutes(parseISO(item.dia), new Date().getTimezoneOffset()),
				"dd/MM/yyyy"
			)
		),
		datasets: [
			{
				label: `Total Sem Match - ${totalSemMatch}`,
				data: data.map((item) => item.total_sem_match),
				backgroundColor: "rgba(255, 99, 132, 0.2)",
				borderColor: "rgba(255, 99, 132, 1)",
				borderWidth: 1,
			},
			{
				label: `Total Com Match - ${totalComMatch}`,
				data: data.map((item) => item.total_com_match),
				backgroundColor: "rgba(18, 242, 48, 0.8)",
				borderColor: "rgba(7, 108, 20, 0.8)",
				borderWidth: 1,
			},
			{
				label: `Total Fora APP - ${totalForaApp}`,
				data: data.map((item) => item.total_fora_app),
				backgroundColor: "rgba(127, 177, 231, 0.8)",
				borderColor: "rgba(1, 56, 114, 0.8)",
				borderWidth: 1,
			},
		],
	};

	// Configurações do gráfico
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Total Cargas Sem Match, Total Cargas com Match e Total Cargas Fora do APP nos Últimos 30 Dias",
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: "Dia",
				},
			},
			y: {
				title: {
					display: true,
					text: "Total",
				},
				beginAtZero: true,
			},
		},
	};

	return (
		<div className="chart-container">
			<Accordion alwaysOpen style={{ marginTop: "20px" }}>
				<Accordion.Item>
					<Accordion.Header>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyItems: "center",
								width: "100%",
							}}
						>
							<b style={{ marginRight: "20px" }}>
								Estatísticas da Integração Concentrador vs App
							</b>
							<div onClick={handleSelectClick}>
								<Select
									className="select-container"
									minMenuHeight={200}
									id="filiais"
									name="filiais"
									isLoading={filiais.length === 0}
									placeholder="Selecionar Grupos"
									options={filiais}
									components={animatedComponents}
									onChange={(option) => setFilial(option)}
									value={filial == null ? filiais[0] : filial}
								/>
							</div>
						</div>
					</Accordion.Header>
					<Accordion.Body>
						<Bar data={chartData} options={options} />
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default BarChart;
