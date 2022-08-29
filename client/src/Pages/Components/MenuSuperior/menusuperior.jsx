import React, { useState } from "react";
import Logo from "../../../assets/logotoraico.png";
import "./style.css";
import { NavbarBrand } from "reactstrap";
import { FaSignOutAlt } from "react-icons/fa";
// import HandleClick from "../../Cargas/Manual/Cadastrar/tooltipsCadastro";

function Menusuperior({ type }) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  console.log(type);
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
              Inicio
            </a>
          </li>
          <div className="class-dropdown">
            <div className="dropdown">
              <button id="style-button-drop" className="dropbtn">
                Carga
              </button>
              <div id="myDropdown" className="dropdown-content">
                <a href="/cargas/menu">Cadastrar Carga</a>
                <a href="/cargas/visualizar">Listagem de Cargas</a>
                <a href="/lotes/visualizar">Listagem de Lotes</a>
                <a href="/producao">Produção</a>
              </div>
            </div>

            <div className="dropdown-doc">
              <button id="style-button-drop" className="dropbtn-doc">
                Documentos
              </button>
              <div id="myDropdown-doc" className="dropdown-content-doc">
                <a href="/veiculos/aprovacao">Monitoramento</a>
                <a href="/veiculos/coordenadas">Coordenadas</a>
                <a href="/relatorios">Relatórios</a>
              </div>
            </div>

            <div className="dropdown-veic">
              <button id="style-button-drop" className="dropbtn-veic">
                Veículos
              </button>
              <div id="myDropdown-veic" className="dropdown-content-veic">
                <a href="/veiculos/raio">Veículos x Veículos</a>
                <a href="/veiculos/destino">Veículos até Empresa</a>
                <a href="/veiculos/raio/empresa">Raio Empresa</a>
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
          <li className="class-li">
            <a id="style-a" href="/ajuda">
              Ajuda
            </a>
          </li>
          <li className="class-li">
            <a id="style-a" href="/">
              Sair <FaSignOutAlt />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Menusuperior;
