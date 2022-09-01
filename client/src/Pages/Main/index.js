import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
// import NavbarNavigator from "../Components/NavbarNavigator";
import { getClaims } from "../../MicrosoftAuthentication";
import "./index.css";
import { Link } from "react-router-dom";

import { SiGooglemaps } from "react-icons/si";
import { FaChartBar, FaTruckMoving } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import Menusuperior from "../Components/MenuSuperior/menusuperior";

const queueCoresAtuais = [];

function Main() {
	const [userData, setUserData] = useState({});

	const inputCorAtual = useRef(null);
	const [visibilidadeTeclas, setVisibilidadeTeclas] = useState(false);
	const [levelGame, setLevelGame] = useState(-1);
	const coresBotoesGame = [
		"primary",
		"secondary",
		"info",
		"success",
		"danger",
		"warning",
	];

	function salvarTimestampUltimaVezJogada() {
		const timestamp = new Date().getTime();
		localStorage.setItem("ultima_vez_jogada", timestamp);
	}

	function usuarioPodeJogar() {
		const ultimaVezJogada = localStorage.getItem("ultima_vez_jogada");
		if (!ultimaVezJogada) {
			return true;
		}

		const diferencaEmMinutos =
			(new Date().getTime() - Number(ultimaVezJogada)) / 60000;
		return diferencaEmMinutos >= 60;
	}

	function popularCoresAtuaisGame(quantidade) {
		for (let i = 0; i < quantidade; i++) {
			const index = Math.ceil(Math.random() * 10000) % coresBotoesGame.length;
			queueCoresAtuais.push(coresBotoesGame[index]);
		}
	}

	function chamarProximoPasso(cor) {
		setVisibilidadeTeclas(false);
		const corCorreta = queueCoresAtuais.shift();
		if (cor !== corCorreta) {
			salvarTimestampUltimaVezJogada();
			toast.error(`Você falhou na rodada ${levelGame}`, { autoClose: false });
			setLevelGame(-1);
			return;
		}
		toast.success("OK", { autoClose: 500 });
		if (queueCoresAtuais.length === 0) {
			setLevelGame((old) => old + 1);
		}
		setVisibilidadeTeclas(true);
	}

	async function mostrarCores() {
		setVisibilidadeTeclas(false);

		const quantidade = queueCoresAtuais.length;

		const pp = [];
		for (let i = 0; i < quantidade; i++) {
			const p = new Promise((resolve) => {
				const interval1 = setTimeout(() => {
					const cor = queueCoresAtuais.shift();
					queueCoresAtuais.push(cor);
					const interval2 = setTimeout(() => {
						if (!inputCorAtual.current) {
							clearInterval(interval1);
							clearInterval(interval2);
							return;
						}
						inputCorAtual.current.setAttribute("class", `w-100 btn`);
					}, 500);
					if (!inputCorAtual.current) {
						clearInterval(interval1);
						clearInterval(interval2);
						return;
					}
					inputCorAtual.current.setAttribute("class", `w-100 btn btn-${cor}`);
					resolve(cor);
				}, (i + 1) * 1500);
			});
			pp.push(p);
		}
		await Promise.all(pp);
		setTimeout(() => {
			if (inputCorAtual.current)
				inputCorAtual.current.setAttribute("class", "w-100 btn");
		}, 2000);
		setVisibilidadeTeclas(true);
	}

	function limparCoresAtuais() {
		queueCoresAtuais.splice(0, queueCoresAtuais.length);
	}

	async function iniciarGame() {
		setVisibilidadeTeclas(true);
		limparCoresAtuais();
		setLevelGame(1);
	}

	useEffect(() => {
		const nome = getClaims().name;
		setUserData({ nome });
	}, []);

	useEffect(() => {
		if (levelGame > -1) {
			popularCoresAtuaisGame(levelGame + 1);
			mostrarCores();
		}
	}, [levelGame]);

	return (
		<>
			<ToastContainer />
			{/* <NavbarNavigator /> */}
			<Menusuperior />
			<Container>
				<Row>
					<Col className="text-center mt-5 mb-5">
						<p id="style-title-main" className="class-p-title-main">
							Seja bem vindo(a) ao Concentrador de Cargas
						</p>
					</Col>
				</Row>
				<div>
					<div>
						<p id="style-p-saudacao" className="class-p-saudacao">
							Caro(a) {userData?.nome}!
						</p>
					</div>
					<div className="class-p-text">
						<p id="style-p-text">
							O concentrador de cargas lhe proporciona uma melhor visibilidade
							de demanda, além de auxiliar sua concentração na <br /> melhor
							tomada de decisão para à escolha de um veículo.
						</p>
					</div>
				</div>

				<div className="class-icons-body">
					<div>
						<Link to="/relatorios" className="text-decoration-none icone-tora">
							<FaChartBar
								size={50}
								style={{ marginLeft: "1rem", color: "#00652E" }}
							/>
							<br />
							<b style={{ color: "#00652E" }}>Relatórios</b>
						</Link>
					</div>
					<div>
						<Link
							to="/veiculos/coordenadas"
							className="text-decoration-none icone-tora"
						>
							<SiGooglemaps
								size={50}
								style={{ marginLeft: "1.5rem", color: "#00652E" }}
							/>
							<br />
							<b style={{ color: "#00652E" }}>Coordenadas</b>
						</Link>
					</div>
					<div>
						<Link
							to="/cargas/visualizar"
							className="text-decoration-none icone-tora"
						>
							<FaTruckMoving size={50} style={{ color: "#00652E" }} />
							<br />
							<b style={{ color: "#00652E" }}>Cargas</b>
						</Link>
					</div>
					<div>
						<Link
							to="/lotes/visualizar"
							className="text-decoration-none icone-tora"
						>
							<FaBoxes size={50} style={{ color: "#00652E" }} />
							<br />
							<b style={{ color: "#00652E" }}>Lotes</b>
						</Link>
					</div>
				</div>

				<Row
					className={
						usuarioPodeJogar() ? "invisible" : "text-center h5 text-danger"
					}
				>
					<Col>
						Você já se exercitou, agora é hora de avaliar seus melhores
						veículos. Desejamos um excelente dia de trabalho!
					</Col>
				</Row>

				<Row className={usuarioPodeJogar() ? "" : "invisible"}>
					{levelGame > -1 && (
						<Row className="mt-5">
							<Col>
								<Button
									variant=""
									ref={inputCorAtual}
									className="w-100"
								></Button>
							</Col>
						</Row>
					)}

					{levelGame > -1 && (
						<Row className="mt-5 text-end">
							<Col>
								Level <b>{levelGame}</b>
							</Col>
						</Row>
					)}
					{levelGame > -1 && (
						<div className="class-jogo">
							{coresBotoesGame.map((i) => (
								<div key={i}>
									<Button
										variant={i}
										className={`w-100 text-${i}`}
										onClick={() => {
											chamarProximoPasso(i);
										}}
										disabled={!visibilidadeTeclas}
									>
										_
									</Button>
								</div>
							))}
						</div>
					)}
					{levelGame === -1 && (
						<div>
							<div className="class-linha-jogo">
								<p id="title-p-jogo">
									{" "}
									Exercite sua memória para garantir uma melhor tomada de
									decisão durante seu dia de trabalho.
								</p>
								<Button
									id="style-button-jogo"
									className="class-button-jogue"
									onClick={iniciarGame}
								>
									Jogue Agora!
								</Button>
							</div>
						</div>
					)}
				</Row>
			</Container>
		</>
	);
}

export default Main;
