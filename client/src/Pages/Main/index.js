import React, { useState, useRef, useEffect } from "react";
import "./main.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
// import NavbarNavigator from "../Components/NavbarNavigator";
import { getClaims } from "../../MicrosoftAuthentication";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
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

	//Trecho que limpar cache quando ouver necessidade...
	const limparCache = localStorage.getItem("clear_Cache");
	if (!limparCache || limparCache !== "version_2") {
		const horasJogo = localStorage.getItem("ultima_vez_jogada");
		localStorage.clear();
		if (horasJogo) {
			localStorage.setItem("ultima_vez_jogada", horasJogo);
		}
		localStorage.setItem("clear_Cache", "version_2");
		location.reload();
	}

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
		return diferencaEmMinutos >= 1440;
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
			<Container className="class-body-main">
				<Row>
					<Col className="text-center mt-5 mb-5">
						<p id="style-title-main" className="title-page-main">
							Seja bem-vindo(a) ao Concentrador de Cargas
						</p>
					</Col>
				</Row>
				<div>
					<div>
						<p id="style-p-saudacao">Caro(a) {userData?.nome}!</p>
					</div>
					<div className="class-p-text">
						<p id="style-p-text">
							O concentrador de cargas lhe proporciona ampla visibilidade de
							demanda, além de auxiliar <br /> sua concentração para a melhor
							tomada de decisão na escolha de um veículo.
						</p>
					</div>
				</div>

				<div className="class-icons-body">
					<div className="icons-efect">
						<Link to="/relatorios" className="class-link">
							<FaChartBar
								size={50}
								id="style-iconn"
								className="class-ico-ind"
							/>
							<br />
							<b id="style-iconn">Indicador Operacional</b>
						</Link>
					</div>
					<div className="icons-efect class-icons-main">
						<Link to="/veiculos/coordenadas" className="class-link">
							<IoLocationSharp
								size={50}
								id="style-iconn-2"
								className="icons-responsive me-4"
							/>
							<br />
							<b id="style-iconn">Coordenadas</b>
						</Link>
					</div>
					<div className="icons-efect">
						<Link to="/cargas/visualizar" className="class-link">
							<FaTruckMoving
								size={50}
								id="style-iconn-3"
								className="icons-responsive"
							/>
							<br />
							<b id="style-iconn">Cargas</b>
						</Link>
					</div>
					<div className="icons-efect icon-lotes">
						<Link to="/lotes/visualizar" className="class-link">
							<FaBoxes
								size={50}
								id="style-iconn-4"
								className="icons-responsive"
							/>
							<br />
							<b id="style-iconn">Lotes</b>
						</Link>
					</div>
				</div>

				<div
					className={
						usuarioPodeJogar() ? "d-none" : "text-center h5 text-danger"
					}
				>
					<p className="class-p-fimjogo">
						Você já se exercitou, agora é hora de avaliar seus melhores
						veículos. Desejamos um excelente dia de trabalho!
					</p>
				</div>

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
						<>
							<div>
								<p id="title-p-jogo">
									{" "}
									Exercite sua memória, garantindo a melhor tomada de decisão
									durante o seu dia de trabalho.
								</p>
							</div>
							<div>
								<div className="class-linha-jogo">
									<Button className="style-button-jogo" onClick={iniciarGame}>
										Exercitar Agora!
									</Button>
								</div>
							</div>
						</>
					)}
				</Row>
			</Container>
		</>
	);
}

export default Main;
