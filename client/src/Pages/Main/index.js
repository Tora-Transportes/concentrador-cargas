import React, { useState, useRef, useEffect, useContext } from "react";
import "./main.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { getClaims } from "../../MicrosoftAuthentication";
import { TbTruckDelivery } from "react-icons/tb";
import { FaChartBar, FaTruckMoving, FaBoxes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import Menusuperior from "../Components/MenuSuperior/menusuperior";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import { MdOutlineNotificationImportant } from "react-icons/md";

const queueCoresAtuais = [];

function Main() {
	const [userData, setUserData] = useState({});
	const [isPermissionCsn, setPermissionCsn] = useState(false);
	const [isPermissionPadrao, setPermissionPadrao] = useState(false);
	const [visibilidadeTeclas, setVisibilidadeTeclas] = useState(false);
	const [levelGame, setLevelGame] = useState(-1);
	const inputCorAtual = useRef(null);

	const coresBotoesGame = [
		"primary",
		"secondary",
		"info",
		"success",
		"danger",
		"warning",
	];
	window.history.replaceState(null, null, "/");
	const { isPermissionUser } = useContext(ContextUseDefault);
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
			toast.error(`Você falhou na rodada ${levelGame}`, { autoClose: 1000 });
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
		if (isPermissionUser?.includes("CARGAS_PADRAO")) {
			setPermissionPadrao(true);
		}
		if (isPermissionUser?.includes("CARGAS_CSN")) {
			setPermissionCsn(true);
		}
	}, [isPermissionUser]);

	useEffect(() => {
		if (levelGame > -1) {
			popularCoresAtuaisGame(levelGame + 1);
			mostrarCores();
		}
	}, [levelGame]);

	const numeroVersao = "V.12";
	return (
		<>
			<ToastContainer />
			<Menusuperior />
			<Container className="class-body-main">
				<Row>
					<Col className="text-center mb-5">
						<p className="style-p-title-main">
							Seja bem-vindo(a) ao Concentrador de Cargas
						</p>
					</Col>
				</Row>

				<div>
					<Link to={"avisos"} className="class-link">
						<MdOutlineNotificationImportant
							size={30}
							className="button-avisos-style"
						/>
						<br />
					</Link>
				</div>
				<div>
					<div>
						<p className="style-p-saudacao">Caro(a) {userData?.nome}!</p>
					</div>
					<div className="class-p-text">
						<p id="style-p-text">
							O concentrador de cargas lhe proporciona ampla visibilidade de
							demanda, além de <br /> auxiliar sua concentração para a melhor
							tomada de decisão na escolha de um veículo.
						</p>
					</div>
				</div>

				<div className="class-icons-body">
					<div className="icons-efect">
						<Link to="/relatorios/visualizar/padrao" className="class-link">
							<FaChartBar size={50} className="class-ico-ind" />
							<br />
							<b id="style-iconn">Indicador Operacional</b>
						</Link>
					</div>
					<div className="icons-efect class-icons-main">
						<Link to="/veiculos/coordenadas" className="class-link">
							<IoLocationSharp
								size={50}
								id="style-iconn"
								className="icons-responsive"
							/>
							<br />
							<b id="style-iconn">Coordenadas</b>
						</Link>
					</div>
					{isPermissionPadrao && (
						<div className="icons-efect">
							<Link to="/cargas/visualizar" className="class-link">
								<FaTruckMoving
									size={50}
									id="style-iconn"
									className="icons-responsive"
								/>
								<br />
								<b id="style-iconn">Cargas</b>
							</Link>
						</div>
					)}
					{isPermissionCsn && (
						<div className="icons-efect">
							<Link to="/cargas/visualizar/csn" className="class-link">
								<TbTruckDelivery
									size={50}
									id="style-iconn"
									className="icons-responsive"
								/>
								<br />
								<b id="style-iconn">Cargas CSN</b>
							</Link>
						</div>
					)}
					<div className="icons-efect icon-lotes">
						<Link to="/lotes/visualizar" className="class-link">
							<FaBoxes
								size={50}
								id="style-iconn"
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

				<Row className={usuarioPodeJogar() ? "" : "d-none"}>
					{levelGame > -1 && (
						<Row className="mt-4">
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
						<Row className="mt-4 text-end">
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
								<p className="title-p-jogo">
									{" "}
									Exercite sua memória, garantindo a melhor tomada de decisão
									durante o seu dia de trabalho.
								</p>
							</div>

							<div className="class-button-jogo">
								<Button className="style-button-jogo" onClick={iniciarGame}>
									Exercitar Agora!
								</Button>
							</div>
						</>
					)}
				</Row>
			</Container>
			<h6 className="versionamento">{numeroVersao}</h6>
		</>
	);
}

export default Main;
