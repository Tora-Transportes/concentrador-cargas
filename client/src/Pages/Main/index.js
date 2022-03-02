import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import NavbarNavigator from "../Components/NavbarNavigator";
import { getClaims } from "../../MicrosoftAuthentication";
import "./index.css";

const queueCoresAtuais = [];

function Main() {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const nome = getClaims().name;
		setUserData({ nome });
	}, []);

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
				setTimeout(() => {
					const cor = queueCoresAtuais.shift();
					queueCoresAtuais.push(cor);
					console.log(cor);
					setTimeout(() => {
						inputCorAtual.current.setAttribute("class", `w-100 btn`);
					}, 500);
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

				{levelGame > -1 && (
					<Row className="mt-5">
						<Col>
							<Button variant="" ref={inputCorAtual} className="w-100"></Button>
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
								Exercite sua memória
							</Button>
						</Col>
					</Row>
				)}
			</Container>
		</>
	);
}

export default Main;
