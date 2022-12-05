import React from "react";
// import "./ajuda.css";
import Menusuperior from "../MenuSuperior/menusuperior";
// import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
// import caminhaogif from "../../../assets/helperTelaInicialCadastro.gif";
// import telacad from "../../../assets/helperTelaCadastroManual.gif";
// import telaCoordenadas from "../../../assets/helperTelaCoordenadas.gif";
// import telaMonitoramento from "../../../assets/helperTelaMonitoramento.gif";
import "./menuSuperior.css";
function LinkRelatorios() {
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
		<div className="body-relatorios">
			<Menusuperior />
			<div>
				<h1 className="h1-relatorios">Relatórios</h1>
			</div>
			<div>
				<p className="subtitle-relatorios">
					Selecione uma das opções e você será redirecionado até a página
					correspondente:
				</p>
				<div className="dropdown-content-veic2 text-center">
					<Button href="/relatorios" id="button-relatorios">
						Indicador Operacional
					</Button>
					<Button href="/rotas/pendentes" id="button-relatorios">
						Rotas Pendentes
					</Button>
					<Button href="/veiculos/raio/empresa" id="button-relatorios">
						Raio Empresa
					</Button>
					<Button href="/veiculos/raio" id="button-relatorios">
						Veículos x Veículos
					</Button>
					<Button href="/veiculos/destino" id="button-relatorios">
						Veículos até Empresa
					</Button>
					<Button href="/veiculos/historico" id="button-relatorios">
						Histórico Veículos
					</Button>
				</div>
			</div>
		</div>
	);
}
export default LinkRelatorios;
