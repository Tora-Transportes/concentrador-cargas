import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logotoraico.png";
import "./menuSuperior.css";
import { NavbarBrand } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../../MicrosoftAuthentication";
import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";

function Menusuperior() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isPermissionCsn, setPermissionCsn] = useState(false);
  const [isPermissionPadrao, setPermissionPadrao] = useState(false);
  useEffect(() => {
    (async () => {
      const userPermission = await validationPermissionUser();
      if (userPermission?.permissoes.includes("CARGAS_PADRAO")) {
        setPermissionPadrao(true);
      }
      if (userPermission?.permissoes.includes("CARGAS_CSN")) {
        setPermissionCsn(true);
      }
    })();
  }, []);

  return (
    <div id="header">
      <NavbarBrand href="/">
        <img src={Logo} alt="Logo Tora" id="logo" />
      </NavbarBrand>
      <nav id="nav" className={isNavExpanded ? "active" : "inactive"}>
        <button
          aria-label="Abrir Menu"
          id="btn-mobile"
          aria-haspopup="true"
          aria-controls="menu"
          aria-expanded="false"
          onClick={() => {
            setIsNavExpanded(!isNavExpanded);
          }}
        >
          <span id="hamburguer"></span>
        </button>
        <ul id="menu" role="menu" className="class-ul">
          <li className="class-li">
            <a id="style-a" href="/">
              Início
            </a>
          </li>
          <div className="class-dropdown">
            <div className="dropdown">
              <button id="style-button-drop" className="dropbtn">
                Cargas
              </button>
              <div id="myDropdown" className="dropdown-content">
                <a href="/cargas/menu">Cadastrar Cargas</a>
                {isPermissionPadrao && (
                  <>
                    <a href="/cargas/visualizar">Listagem de Cargas</a>
                    <a href="/lotes/visualizar">Listagem de Lotes</a>
                  </>
                )}
                {isPermissionCsn && (
                  <a href="/cargas/visualizar/csn">Listagem CSN</a>
                )}
              </div>
            </div>
          </div>
          <div className="class-dropdown">
            <div className="dropdown">
              <button id="style-button-drop" className="dropbtn">
                Monitoramento
              </button>
              <div id="myDropdown" className="dropdown-content">
                {isPermissionPadrao && (
                  <a href="/veiculos/aprovacao/padrao">Padrão</a>
                )}
                {isPermissionCsn && <a href="/veiculos/aprovacao/csn">CSN</a>}
              </div>
            </div>
          </div>
          <li className="class-li">
            <a id="style-a" href="/usuarios/permissoes">
              Permissões
            </a>
          </li>
          <li className="class-li">
            <a id="style-a" href="/produtos">
              Produtos
            </a>
          </li>
          <div className="class-dropdown">
            <div className="dropdown-veic">
              {/* <button id="style-button-drop" className="dropbtn-veic"> */}
              <a
                href="/relatorios/visualizar"
                className="dropbtn-veic"
                id="link-rel"
              >
                Relatórios
              </a>

              {/* <div id="myDropdown-veic" className="dropdown-content-veic">
                <a href="/relatorios">Indicador Operacional</a>
                <a href="/rotas/pendentes">Rotas Pendentes</a>
                <a href="/veiculos/raio/empresa">Raio Empresa</a>
                <a href="/veiculos/raio">Veículos x Veículos</a>
                <a href="/veiculos/destino">Veículos até Empresa</a>
                <a href="/veiculos/historico">Histórico Veículos</a>
              </div> */}
            </div>
          </div>
          {isPermissionCsn && (
            <li className="class-li">
              <a id="style-a" href="/localizacao">
                Localização
              </a>
            </li>
          )}
          <li className="class-li">
            <a id="style-a" href="/ajuda">
              Ajuda
            </a>
          </li>
          <li className="class-li" to="/">
            <a
              id="style-a"
              onClick={() => {
                setTimeout(() => {
                  logout();
                }, 200);
              }}
            >
              Sair <FaSignOutAlt />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Menusuperior;
