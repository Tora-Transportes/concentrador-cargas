import React, { useState, useEffect, useContext } from "react";
import Menusuperior from "../MenuSuperior/menusuperior";
import { Button } from "react-bootstrap";
import "./menuSuperior.css";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
function LinkRelatorios() {
	const [isPermissionCsn, setPermissionCsn] = useState(false);
	const [isPermissionPadrao, setPermissionPadrao] = useState(false);
	const [isPermissionHistorico, setPermissionHistorico] = useState(false);
	const [isPermissionOperacionalApp, setPermissionOperacionalApp] =
		useState(false);
	const { isPermissionUser } = useContext(ContextUseDefault);

	const permissions = {
		CARGAS_PADRAO: setPermissionPadrao,
		CARGAS_CSN: setPermissionCsn,
		HISTORICO_VEICULOS_2: setPermissionHistorico,
		ENVIAR_CARGA_APP: setPermissionOperacionalApp,
	};
	console.log("entender");
	useEffect(() => {
		if (isPermissionUser) {
			for (const permission in permissions) {
				if (isPermissionUser.includes(permission)) {
					permissions[permission](true);
				}
			}
		}
	}, [isPermissionUser, permissions]);
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
					{isPermissionOperacionalApp && (
						<Button href="/relatorios/app/visualizar" id="button-relatorios">
							Indicador Operacional APP
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
					{isPermissionHistorico && (
						<Button href="/veiculos/historico/tempo" id="button-relatorios">
							Histórico Veículos 2.0
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
export default LinkRelatorios;
