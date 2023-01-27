import React, { useState, useEffect, useContext } from "react";
// import "./ajuda.css";
import Menusuperior from "../MenuSuperior/menusuperior";
// import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
// import caminhaogif from "../../../assets/helperTelaInicialCadastro.gif";
// import telacad from "../../../assets/helperTelaCadastroManual.gif";
// import telaCoordenadas from "../../../assets/helperTelaCoordenadas.gif";
// import telaMonitoramento from "../../../assets/helperTelaMonitoramento.gif";
import "./menuSuperior.css";
//import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
function LinkRelatorios() {
	const [isPermissionCsn, setPermissionCsn] = useState(false);
	const [isPermissionPadrao, setPermissionPadrao] = useState(false);
	const { isPermissionUser } = useContext(ContextUseDefault);
	useEffect(() => {
		//(async () => {
		//const userPermission = await validationPermissionUser();
		if (isPermissionUser?.includes("CARGAS_PADRAO")) {
			setPermissionPadrao(true);
		}
		if (isPermissionUser?.includes("CARGAS_CSN")) {
			setPermissionCsn(true);
		}
		//})();
	}, [isPermissionUser]);
	let acc = document.getElementsByClassName("accordion");
	let i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			this.classList.toggle("active");
			let panel = this.nextElementSibling;
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
					Selecione uma das opções e você será direcionado até a página
					correspondente:
				</p>
				<div className="dropdown-content-veic2 text-center">
					{isPermissionPadrao && (
						<Button href="/relatorios/visualizar/padrao" id="button-relatorios">
							Indicador Operacional padrão
						</Button>
					)}
					{isPermissionCsn && (
						<Button href="/relatorios/visualizar/csn" id="button-relatorios">
							Indicador Operacional CSN
						</Button>
					)}
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
