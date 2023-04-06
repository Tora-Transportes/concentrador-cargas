import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../../../assets/logotoraico.png";
import "./menuSuperior.css";
import { NavbarBrand } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../../MicrosoftAuthentication";
import { validationPermissionUser } from "src/Pages/Utils/validationPermissionUser";
import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";

function Menusuperior() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const hamburgerRef = useRef(null);
  const [isPermissionCsn, setPermissionCsn] = useState(false);
  const [isPermissionPadrao, setPermissionPadrao] = useState(false);
  const [isPermAlterarPerm, setPermAlterarPerm] = useState(false);
  const [isColorHeader, setColorHeader] = useState("header");
  const { setPermissionUser } = useContext(ContextUseDefault);
  useEffect(() => {
    (async () => {
      const userPermission = await validationPermissionUser();
      setPermissionUser(userPermission?.permissoes);
      if (userPermission?.permissoes?.includes("CARGAS_PADRAO"))
        setPermissionPadrao(true);

      if (userPermission?.permissoes?.includes("CARGAS_CSN"))
        setPermissionCsn(true);

      if (userPermission?.permissoes?.includes("ALTERAR_PERMISSOES"))
        setPermAlterarPerm(true);
    })();
    const tipoCorHeader =
      process.env.REACT_APP_COR_NAVEBAR === "DEV" ? "headerDev" : "header";
    setColorHeader(tipoCorHeader);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsNavExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [hamburgerRef]);

  return (
    <div id={isColorHeader}>
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
          ref={hamburgerRef}
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
              {(isPermissionCsn || isPermissionPadrao) && (
                <button id="style-button-drop" className="dropbtn">
                  Cargas
                </button>
              )}
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
          <li className="class-li">
            <a id="style-a" href="/veiculos/coordenadas">
              Coordenadas
            </a>
          </li>
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
          {isPermAlterarPerm && (
            <li className="class-li">
              <a id="style-a" href="/usuarios/permissoes">
                Permissões
              </a>
            </li>
          )}
          <li className="class-li">
            <a id="style-a" href="/produtos">
              Produtos
            </a>
          </li>
          <div className="class-dropdown">
            <div className="dropdown-veic">
              <a
                href="/relatorios/visualizar"
                className="dropbtn-veic"
                id="link-rel"
              >
                Relatórios
              </a>
            </div>
          </div>
          {isPermissionCsn && (
            <li className="class-li">
              <a id="style-a" href="/localizacao">
                Localização
              </a>
            </li>
          )}
          {/* {isPermissionPadrao && isPermissionCsn ? (
            <div className="class-dropdown">
              <div className="dropdown">
                <button id="style-button-drop" className="dropbtn">
                  Ajuda
                </button>
                <div id="myDropdown" className="dropdown-content">
                  <>
                    <a href="/ajuda">Ajuda Padrão</a>
                    <a href="/ajuda/CSN">Ajuda CSN</a>
                  </>
                </div>
              </div>
            </div>
          ) : isPermissionCsn ? (
            <li className="class-li">
              <a id="style-a" href="/ajuda/CSN">
                Ajuda CSN
              </a>
            </li>
          ) : (
            isPermissionPadrao && (
              <li className="class-li">
                <a id="style-a" href="/ajuda">
                  Ajuda
                </a>
              </li>
            )
          )} */}

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
