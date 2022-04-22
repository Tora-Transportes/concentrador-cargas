import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import NavbarNavigator from "../Components/NavbarNavigator";
import { getClaims } from "../../MicrosoftAuthentication";
import "./index.css";
import { Link } from "react-router-dom";

import { SiGooglemaps } from "react-icons/si";
import { FaChartBar, FaTruckMoving } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";

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
		console.log("populando com", quantidade, "cores");
		for (let i = 0; i < quantidade; i++) {
			const index = Math.ceil(Math.random() * 10000) % coresBotoesGame.length;
			console.log(`Cor: ${coresBotoesGame[index]}`);
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
			console.log("Gerando novas cores");
			setLevelGame((old) => old + 1);
		}
		setVisibilidadeTeclas(true);
	}

	async function mostrarCores() {
		console.log("MOSTRANDO CORES");
		setVisibilidadeTeclas(false);

		const quantidade = queueCoresAtuais.length;

		const pp = [];
		for (let i = 0; i < quantidade; i++) {
			const p = new Promise((resolve) => {
				const interval1 = setTimeout(() => {
					const cor = queueCoresAtuais.shift();
					queueCoresAtuais.push(cor);
					console.log(cor);
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
			<NavbarNavigator />
			<Container>
				<Row>
					<Col className="text-center mt-5 mb-5">
						<h1>Seja bem vindo(a) ao Concentrador de cargas</h1>
					</Col>
				</Row>
				<Row>
					<Col sm={12} className="mt-2">
						<h4>
							Caro(a) <strong>{userData?.nome}</strong>!
						</h4>
					</Col>
					<Col>
						<ul>
							<li className="h5">
								O concentrador de cargas lhe proporciona uma melhor visibilidade
								de demanda, além de auxiliar sua concentração na melhor tomada
								de decisão para à escolha de um veículo.
							</li>
						</ul>
					</Col>
				</Row>

				<hr className="mb-5 mt-5" />

				<Row className="text-center">
					<Col lg={3}>
						<Link to="/relatorios" className="text-decoration-none icone-tora">
							<FaChartBar size={50} />
							<br />
							<b>Relatórios</b>
						</Link>
					</Col>
					<Col lg={3}>
						<Link
							to="/veiculos/coordenadas"
							className="text-decoration-none icone-tora"
						>
							<SiGooglemaps size={50} />
							<br />
							<b>Coordenadas</b>
						</Link>
					</Col>
					<Col lg={3}>
						<Link
							to="/cargas/visualizar"
							className="text-decoration-none icone-tora"
						>
							<FaTruckMoving size={50} />
							<br />
							<b>Cargas</b>
						</Link>
					</Col>
					<Col lg={3}>
						<Link
							to="/lotes/visualizar"
							className="text-decoration-none icone-tora"
						>
							<FaBoxes size={50} />
							<br />
							<b>Lotes</b>
						</Link>
					</Col>
				</Row>

				<hr className="mb-5 mt-5" />

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
						<Row className="mt-5">
							{coresBotoesGame.map((i) => (
								<Col key={i}>
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
								</Col>
							))}
						</Row>
					)}
					{levelGame === -1 && (
						<Row className="mt-5">
							<Col>
								<Button
									variant="outline-success"
									className="w-100"
									onClick={iniciarGame}
								>
									Exercite sua memória para garantir uma melhor tomada de
									decisão durante seu dia de trabalho.
								</Button>
							</Col>
						</Row>
					)}
				</Row>
				<hr className="mb-5 mt-5" />
			</Container>
		</>
	);
}

export default Main;
