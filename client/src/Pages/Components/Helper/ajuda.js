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
				<h1 className="class-h1-ajuda">Ajuda</h1>
				<hr className="class-hr-ajuda" />
				<p className="class-p-ajuda">
					Bem-vindo ao Ajuda, nessa página será disponibilizado o passo a passo
					para as seguintes telas:
					<br />
					<strong>Coordenadas, Monitoramento e Cadastro de Cargas.</strong>
				</p>

				<p className="class-p-ajuda">
					Selecione uma das opções e você será redirecionado até a página que
					dará início ao passo a passo correspondente:
				</p>
			</div>

			<Accordion
				defaultActiveKey={["0"]}
				alwaysOpen
				className="class-accordion"
			>
				<Accordion.Item eventKey="1" id="style-button-accordion">
					<Accordion.Header id="style-ac-header" className="class-header-acc">
						Cadastrar Cargas
					</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							O primeiro passo irá te direcionar para uma página, em que você
							deverá selecionar o modo que deseja cadastrar a carga.
						</p>
						<p>Exemplo da Página de Seleção: </p>

						<img src={caminhaogif} id="style-gif" />
						<p>
							Escolhido o modo de cadastro da carga, você será direcionado até a
							página de cadastro conforme a opção escolhida.
						</p>
						<p>Exemplo da página de Cadastro: </p>
						<img src={telacad} id="style-gif" />
						<div className="class-button-ir">
							{/* <p className="class-p-nav">Navegar até a Página de Cadastro</p> */}
							<Button
								href="/cargas/menu"
								id="style-button-acc-1"
								className="class-button1"
							>
								Navegar até a Página de Cadastro
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2" id="style-button-accordion">
					<Accordion.Header id="style-ac-header" className="class-header-acc">
						Coordenadas
					</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							A opção Coordenadas disponibiliza localização, destino, categoria,
							placa, dentre outras informações sobre os veículos cadastrados.
						</p>
						<p>Exemplo da página Coordenadas:</p>
						<img src={telaCoordenadas} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">Navegar até a Página de Coordenadas</p> */}
							<Button
								href="/veiculos/coordenadas"
								id="style-button-acc-1"
								className="class-button1"
							>
								Navegar até a Página de Coordenadas
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="3" id="style-button-accordion">
					<Accordion.Header id="style-ac-header" className="class-header-acc">
						Monitoramento
					</Accordion.Header>
					<Accordion.Body className="class-body-accordion">
						<p>
							Nessa opção você será direcionado para a página de Monitoramento,
							onde conseguirá verificar a situação dos veículos pendentes, e
							aprovar ou reprovar esses veículos de acordo com a situação de
							cada um.
						</p>
						<p>Exemplo da página de Monitoramento: </p>
						<img src={telaMonitoramento} id="style-gif" />

						<div className="class-button-ir">
							{/* <p className="class-p-nav">
								Navegar até a Página de Monitoramento
							</p> */}
							<Button
								href="/veiculos/aprovacao"
								id="style-button-acc-1"
								className="class-button1"
							>
								Navegar até a Página de Monitoramento
							</Button>
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
}
export default Helper;
