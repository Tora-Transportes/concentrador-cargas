import React from "react";
import "./style.css";
import Menusuperior from "../MenuSuperior/menusuperior";
import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import caminhaogif from "../../../assets/helperTelaInicialCadastro.gif";
import telacad from "../../../assets/helperTelaCadastroManual.gif";
import telaCoordenadas from "../../../assets/helperTelaCoordenadas.gif";
import telaMonitoramento from "../../../assets/helperTelaMonitoramento.gif";
function Helper() {
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			this.classList.toggle("active");
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
			}
		});
	}
	return (
		<div className="class-body">
			<Menusuperior />
			<div className="class-body-title">
				<h1>Ajuda</h1>
				<hr />
				<p>
					Bem - vindo a tela Ajuda, nesta página será disponibilizado passo a
					passo para as seguintes telas:
					<br />
					<strong>Coordenadas, Monitoramento e Cadastro de Cargas.</strong>
				</p>

				<p>
					Selecione uma das opções e será redirecionado até a página para
					iniciar o passo a passo:
				</p>
			</div>

			<Accordion
				defaultActiveKey={["0"]}
				alwaysOpen
				className="class-accordion"
			>
				<Accordion.Item eventKey="0" id="style-button-accordion">
					<Accordion.Header id="style-ac-header" className="class-header-acc">
						Cadastrar Carga
					</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							No primeiro passo será direcionado para uma página em que você irá
							selecionar em qual forma deseja cadastrar a carga.
						</p>
						<p>Exemplo: Página de Selecão </p>
						<img
							src={caminhaogif}
							style={{ width: "45rem", marginLeft: "3rem" }}
						/>

						<p>
							Ao escolher a forma que irá cadastrar a Carga, será direcionado
							para a página de Cadastro sendo manual ou importada.
						</p>
						<p>Exemplo: Página de Cadastro </p>
						<img src={telacad} style={{ width: "45rem", marginLeft: "3rem" }} />
						<Button
							href="/cargas/menu"
							id="style-button-acc-1"
							className="class-button1"
						>
							Navegar até a Página
						</Button>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1" id="style-button-accordion">
					<Accordion.Header>Coordenadas</Accordion.Header>
					<Accordion.Body>
						<p>
							No primeiro passo será direcionado para uma página em que você irá
							selecionar em qual forma deseja cadastrar a carga.
						</p>
						<p>Exemplo: Página de Selecão </p>
						<img
							src={telaCoordenadas}
							style={{ width: "45rem", marginLeft: "3rem" }}
						/>

						<Button
							href="/veiculos/coordenadas"
							id="style-button-acc-1"
							className="class-button2"
						>
							Navegar até a Página
						</Button>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2" id="style-button-accordion">
					<Accordion.Header>Monitoramento</Accordion.Header>
					<Accordion.Body>
						<p>
							No primeiro passo será direcionado para uma página em que você irá
							selecionar em qual forma deseja cadastrar a carga.
						</p>
						<p>Exemplo: Página de Selecão </p>
						<img
							src={telaMonitoramento}
							style={{ width: "45rem", marginLeft: "3rem" }}
						/>
						<Button
							href="/veiculos/coordenadas"
							id="style-button-acc-1"
							className="class-button3"
						>
							Navegar até a Página
						</Button>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
}
export default Helper;
